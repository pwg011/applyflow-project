import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = (
  process.env.SCREENSHOT_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const outputDir = path.resolve(
  process.cwd(),
  process.env.SCREENSHOT_DIR || "portfolio-screenshots",
);

const viewport = { width: 1440, height: 1000 };
const skipped = [];

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 2500 }).catch(() => {});
  await page.waitForTimeout(350);
}

async function openPage(page, route) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
  await settle(page);
}

async function clickVisible(locator) {
  await locator.first().waitFor({ state: "visible", timeout: 6000 });
  await locator.first().click();
}

async function capture(page, name) {
  await settle(page);
  await page.screenshot({
    path: path.join(outputDir, `${name}.png`),
    fullPage: false,
  });
  console.log(`Captured ${name}.png`);
}

async function runState(page, name, action) {
  try {
    await action();
    await capture(page, name);
  } catch (error) {
    skipped.push({ name, reason: error.message });
    console.warn(`Skipped ${name}: ${error.message}`);
  }
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport,
  deviceScaleFactor: 1,
});

page.setDefaultTimeout(7000);

await runState(page, "01-jobs-dashboard", async () => {
  await openPage(page, "/");
  await page.getByRole("heading", { name: "Jobs" }).waitFor();
});

await runState(page, "02-import-job-modal", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: /import job/i }));
  await page.getByRole("heading", { name: "Import Job" }).waitFor();
});

await runState(page, "03-import-preview-modal", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: /import job/i }));
  await clickVisible(page.getByRole("button", { name: /^import$/i }));
  await page.getByRole("heading", { name: "Review imported job" }).waitFor();
});

await runState(page, "04-edit-application-drawer", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: "Edit Details" }));
  await page.getByRole("heading", { name: "Edit Application" }).waitFor();
});

await runState(page, "05-application-details-drawer", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: "View Job" }));
  await page.getByText("Application Details").waitFor();
});

await runState(page, "06-delete-confirmation-modal", async () => {
  await openPage(page, "/");
  await clickVisible(
    page.getByRole("button", { name: "Delete application" }),
  );
  await page.getByRole("heading", { name: "Delete application?" }).waitFor();
});

await runState(page, "07-profiles-dashboard", async () => {
  await openPage(page, "/personas");
  await page.getByRole("heading", { name: "Profiles" }).waitFor();
});

await runState(page, "08-template-selection-modal", async () => {
  await openPage(page, "/personas");
  await clickVisible(page.getByRole("button", { name: /new template/i }));
  await page.getByRole("heading", { name: "Start from an industry baseline" }).waitFor();
});

await runState(page, "09-create-profile-modal", async () => {
  await openPage(page, "/personas");
  await clickVisible(
    page.getByRole("button", { name: /create profile/i }),
  );
  await page.getByText("Personal Foundation").waitFor();
});

await runState(page, "10-profile-details-modal", async () => {
  await openPage(page, "/personas");
  await clickVisible(page.getByRole("button", { name: "View Profile" }));
  await page.getByText("Profile Details").waitFor();
});

await runState(page, "11-cv-review-modal", async () => {
  await openPage(page, "/personas");
  await clickVisible(page.getByRole("button", { name: "View Profile" }));
  await clickVisible(page.getByRole("button", { name: "Review CV" }));
  await page.getByText("CV / Profile Review").waitFor();
});

await runState(page, "12-empty-no-jobs", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: "No Jobs" }));
  await page.getByRole("heading", { name: "No jobs yet" }).waitFor();
  await page.getByRole("heading", { name: "No selected jobs" }).waitFor();
});

await runState(page, "13-empty-no-selected-job", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: "No Selection" }));
  await page.getByRole("heading", { name: "No selected jobs" }).waitFor();
});

await runState(page, "14-empty-no-job-analysis", async () => {
  await openPage(page, "/");
  await clickVisible(page.getByRole("button", { name: "No Analysis" }));
  await page.getByRole("heading", { name: "Review imported job" }).waitFor();
  await page.getByText("No job analysis yet").waitFor();
});

await runState(page, "15-empty-no-profiles", async () => {
  await openPage(page, "/personas");
  await clickVisible(page.getByRole("button", { name: "No Profiles" }));
  await page.getByRole("heading", { name: "No profiles yet" }).waitFor();
});

await runState(page, "16-empty-no-cv-uploaded", async () => {
  await openPage(page, "/personas");
  await clickVisible(
    page.getByRole("button", { name: "View Profile" }).nth(1),
  );
  await page.getByText("No CV uploaded").waitFor();
});

await browser.close();

if (skipped.length > 0) {
  console.log("\nSome screenshots need a stable demo route or test id:");
  for (const item of skipped) {
    console.log(`- ${item.name}: ${item.reason}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\nSaved screenshots to ${outputDir}`);
}
