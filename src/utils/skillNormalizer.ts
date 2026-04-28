type SkillCategoryName = "Explicit" | "Inferred" | "Suggested";

type ParsedSkillCategories = Record<SkillCategoryName, string[]>;

const CATEGORY_ORDER: SkillCategoryName[] = [
  "Explicit",
  "Inferred",
  "Suggested",
];

const WEAK_PREFIX_PATTERNS = [
  /^(basic understanding of)\s+/i,
  /^(understanding of)\s+/i,
  /^(good understanding of)\s+/i,
  /^(strong understanding of)\s+/i,
  /^(working knowledge of)\s+/i,
  /^(knowledge of)\s+/i,
  /^(familiarity with)\s+/i,
  /^(experience with)\s+/i,
  /^(experience in)\s+/i,
  /^(ability to)\s+/i,
  /^(ability in)\s+/i,
  /^(capability in)\s+/i,
];

const TRAILING_FILLER_PATTERNS = [
  /\s+skills?$/i,
  /\s+ability$/i,
  /\s+capabilities$/i,
  /\s+knowledge$/i,
];

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bteam work\b/gi, "teamwork"],
  [/\bproblem solving\b/gi, "problem-solving"],
  [/\bdecision making\b/gi, "decision-making"],
  [/\btime management\b/gi, "time management"],
  [/\bdigital payment systems\b/gi, "digital payments"],
  [/\bdigital payments ecosystem knowledge\b/gi, "digital payments domain knowledge"],
  [/\bfintech platforms\b/gi, "fintech platforms"],
  [/\brest api(s)?\b/gi, "REST APIs"],
  [/\bapi integrations?\b/gi, "API integration"],
  [/\bversion control systems?\b/gi, "version control"],
  [/\bagile methodology\b/gi, "Agile methodology"],
  [/\bagile basics\b/gi, "Agile fundamentals"],
  [/\bsql basics\b/gi, "SQL fundamentals"],
  [/\bdebugging basics\b/gi, "debugging"],
  [/\btesting basics\b/gi, "software testing"],
];

const GENERIC_SINGLE_WORDS = new Set([
  "communication",
  "teamwork",
  "support",
  "learning",
  "training",
  "programming",
]);

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^[A-Z0-9.+#/-]+$/.test(word)) {
        return word;
      }

      if (/^(api|apis|sql|crm|erp|ui|ux|qa|seo|sem|etl|aws|gcp)$/i.test(word)) {
        return word.toUpperCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeSkillLabel(rawSkill: string, category: SkillCategoryName) {
  let skill = normalizeWhitespace(rawSkill)
    .replace(/^[\-\u2022*]+/, "")
    .replace(/[.;:]+$/g, "")
    .trim();

  if (!skill || /^none$/i.test(skill)) {
    return null;
  }

  for (const pattern of WEAK_PREFIX_PATTERNS) {
    skill = skill.replace(pattern, "");
  }

  for (const pattern of TRAILING_FILLER_PATTERNS) {
    if (!GENERIC_SINGLE_WORDS.has(skill.toLowerCase())) {
      skill = skill.replace(pattern, "");
    }
  }

  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    skill = skill.replace(pattern, replacement);
  }

  skill = normalizeWhitespace(skill.replace(/[()]+/g, ""));

  if (!skill) {
    return null;
  }

  const lowerSkill = skill.toLowerCase();

  if (GENERIC_SINGLE_WORDS.has(lowerSkill)) {
    if (category === "Explicit") {
      return null;
    }

    return toTitleCase(skill);
  }

  if (
    /^(knowledge|understanding|experience|ability|skills?)$/i.test(lowerSkill)
  ) {
    return null;
  }

  if (/^[a-z]/.test(skill) && !/[A-Z]{2,}/.test(skill)) {
    skill = toTitleCase(skill);
  }

  return skill;
}

function dedupeSkills(skills: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const skill of skills) {
    const dedupeKey = skill
      .toLowerCase()
      .replace(/[^a-z0-9+#/.\s-]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!dedupeKey || seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    normalized.push(skill);
  }

  return normalized;
}

function parseCategorySection(
  skillsText: string,
  category: SkillCategoryName,
  nextCategory?: SkillCategoryName,
) {
  const startMarker = `${category}:`;
  const startIndex = skillsText.indexOf(startMarker);

  if (startIndex === -1) {
    return null;
  }

  const contentStart = startIndex + startMarker.length;
  const endIndex = nextCategory
    ? skillsText.indexOf(`| ${nextCategory}:`, contentStart)
    : skillsText.length;

  if (endIndex === -1) {
    return null;
  }

  return skillsText.slice(contentStart, endIndex).trim();
}

function parseJobSkills(skillsText: string): ParsedSkillCategories | null {
  const explicit = parseCategorySection(skillsText, "Explicit", "Inferred");
  const inferred = parseCategorySection(skillsText, "Inferred", "Suggested");
  const suggested = parseCategorySection(skillsText, "Suggested");

  if (explicit === null || inferred === null || suggested === null) {
    return null;
  }

  return {
    Explicit: explicit
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    Inferred: inferred
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    Suggested: suggested
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

function formatCategory(category: SkillCategoryName, skills: string[]) {
  return `${category}: ${skills.length > 0 ? skills.join(", ") : "None"}`;
}

export function normalizeJobSkills(jobSkills?: string | null) {
  if (!jobSkills || !jobSkills.trim()) {
    return jobSkills ?? null;
  }

  const parsed = parseJobSkills(jobSkills);

  if (!parsed) {
    return jobSkills;
  }

  const normalizedCategories: ParsedSkillCategories = {
    Explicit: [],
    Inferred: [],
    Suggested: [],
  };

  for (const category of CATEGORY_ORDER) {
    const cleanedSkills = parsed[category]
      .map((skill) => normalizeSkillLabel(skill, category))
      .filter((skill): skill is string => Boolean(skill));

    normalizedCategories[category] = dedupeSkills(cleanedSkills);
  }

  return CATEGORY_ORDER.map((category) =>
    formatCategory(category, normalizedCategories[category]),
  ).join(" | ");
}
