type SourceType = "link" | "text" | "link_and_text" | "manual";

export function formatTodayForDisplay() {
  const today = new Date();

  return `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}/${today.getFullYear()}`;
}

export function convertDisplayDateToDbDate(displayDate: string) {
  const trimmedDate = displayDate.trim();

  if (!trimmedDate) {
    return null;
  }

  const [day, month, year] = trimmedDate.split("/");

  if (
    !day ||
    !month ||
    !year ||
    day.length !== 2 ||
    month.length !== 2 ||
    year.length !== 4
  ) {
    return null;
  }

  const dayNumber = Number(day);
  const monthNumber = Number(month);
  const yearNumber = Number(year);

  if (
    Number.isNaN(dayNumber) ||
    Number.isNaN(monthNumber) ||
    Number.isNaN(yearNumber) ||
    dayNumber < 1 ||
    dayNumber > 31 ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

export function detectSourceType(
  jobUrl: string,
  rawJobText: string,
): SourceType {
  const hasJobUrl = jobUrl.trim() !== "";
  const hasRawJobText = rawJobText.trim() !== "";

  if (hasJobUrl && hasRawJobText) {
    return "link_and_text";
  }

  if (hasJobUrl) {
    return "link";
  }

  if (hasRawJobText) {
    return "text";
  }

  return "manual";
}

export function extractBasicJobFields(rawJobText: string) {
  const result = {
    company: "",
    role: "",
  };
  const textLines = rawJobText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const roleStopWords = ["we", "are", "looking", "responsibilities"];
  const genericRoleWords = [
    "program",
    "applications",
    "apply",
    "invited",
    "deadline",
    "table of contents",
  ];
  const roleKeywords = [
    "trainee",
    "engineer",
    "analyst",
    "developer",
    "manager",
    "intern",
    "graduate trainee",
    "officer",
    "specialist",
  ];

  function cleanValue(value: string) {
    return value.replace(/^[\s,.:;!-]+|[\s,.:;!-]+$/g, "").trim();
  }

  function cleanRole(value: string) {
    return cleanValue(value)
      .replace(/^\d{4}\s+/, "")
      .replace(/\s+program$/i, "")
      .trim();
  }

  for (const line of textLines.slice(0, 8)) {
    const companyMatch = line.match(
      /^(company|company name|organization|employer):\s*(.+)$/i,
    );
    if (!result.company && companyMatch?.[2]) {
      result.company = cleanValue(companyMatch[2]);
    }

    const roleAtCompanyMatch = line.match(/^(.+?)\s+at\s+(.+)$/i);
    if (roleAtCompanyMatch) {
      if (!result.company) {
        result.company = cleanValue(roleAtCompanyMatch[2]);
      }
    }
  }

  const exactStrongRoleLine = textLines.find(
    (line) => /^Graduate Trainee\s*\(.+\)$/i.test(line.trim()),
  );

  if (exactStrongRoleLine) {
    result.role = cleanRole(exactStrongRoleLine);
  }

  const firstTitleLine = textLines[0] ?? "";
  const roleCandidates = textLines.slice(0, 15).flatMap((line) => {
    const normalizedLine = line.toLowerCase();
    const isShortEnough = line.length > 0 && line.length < 80;
    const hasBlockedWord = roleStopWords.some((word) =>
      normalizedLine.includes(word),
    );

    if (!isShortEnough || hasBlockedWord) {
      return [];
    }

    const roleAtCompanyMatch = line.match(/^(.+?)\s+at\s+(.+)$/i);
    const candidateRole = cleanRole(
      roleAtCompanyMatch ? roleAtCompanyMatch[1] : line,
    );
    const candidateCompany = roleAtCompanyMatch
      ? cleanValue(roleAtCompanyMatch[2])
      : "";

    if (!candidateRole) {
      return [];
    }

    const score =
      (line.includes("(") ? 20 : 0) +
      (roleKeywords.some((word) => normalizedLine.includes(word)) ? 4 : 0) +
      (normalizedLine.includes("program") ? -20 : 0) +
      (normalizedLine.includes("2026") ? -20 : 0) +
      (normalizedLine.includes(" at ") ? -5 : 0) +
      (genericRoleWords.some((word) => normalizedLine.includes(word)) ? -5 : 0);

    return [
      {
        role: candidateRole,
        company: candidateCompany,
        score,
        isStrong:
          line.includes("(") ||
          roleKeywords.some((word) => normalizedLine.includes(word)),
      },
    ];
  });

  roleCandidates.sort((left, right) => right.score - left.score);

  const bestCandidate =
    result.role
      ? {
          role: result.role,
          company: "",
          score: Number.MAX_SAFE_INTEGER,
          isStrong: true,
        }
      : roleCandidates.find((candidate) => candidate.isStrong) ?? roleCandidates[0];

  if (bestCandidate) {
    result.role = bestCandidate.role;
    if (!result.company && bestCandidate.company) {
      result.company = bestCandidate.company;
    }
  } else if (firstTitleLine) {
    result.role = cleanRole(firstTitleLine);
  }

  return result;
}
