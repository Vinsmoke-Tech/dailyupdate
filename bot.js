// daily_bot.js
const fs = require("fs");
const simpleGit = require("simple-git");
const { execSync } = require("child_process");

const git = simpleGit();

// ================== CONFIG ==================
const TRACKING_FILE = "commit_tracking.json";
const ISSUE_TRACKING_FILE = "issue_tracking.json";
const DAILY_FILE = "daily_update.txt";
const BRANCH_NAME = "auto/daily-update";
const BASE_BRANCH = "main"; // branch target PR
// ============================================

// ---------------- Commit & PR ----------------
function initTracking() {
  if (!fs.existsSync(TRACKING_FILE)) {
    fs.writeFileSync(
      TRACKING_FILE,
      JSON.stringify({ count: 0, last_commit: null }, null, 2)
    );
  }
}

function updateTracking() {
  const tracking = JSON.parse(fs.readFileSync(TRACKING_FILE, "utf-8"));
  tracking.count += 1;
  tracking.last_commit = new Date().toISOString();
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(tracking, null, 2));
}

function updateDailyLog() {
  const logLine = `${new Date().toISOString()} - Daily update completed\n`;
  fs.appendFileSync(DAILY_FILE, logLine);
}

async function makeCommit() {
  const branches = await git.branchLocal();
  if (!branches.all.includes(BRANCH_NAME)) {
    await git.checkoutLocalBranch(BRANCH_NAME);
  } else {
    await git.checkout(BRANCH_NAME);
  }

  await git.add([TRACKING_FILE, DAILY_FILE]);
  await git.commit(
    `Daily update & progress tracking - ${new Date().toISOString()}`
  );
  await git.push("origin", BRANCH_NAME, { "--force": null });
  console.log(`✅ Commit & push sukses ke branch ${BRANCH_NAME}`);
}

function createPullRequest() {
  try {
    execSync(
      `gh pr create --base ${BASE_BRANCH} --head ${BRANCH_NAME} --title "Daily Update & Progress Tracking" --body "Automated daily update & commit tracking."`,
      { stdio: "inherit" }
    );
    console.log("✅ PR berhasil dibuat");
  } catch (err) {
    console.log("ℹ️ PR mungkin sudah ada, atau GitHub CLI belum login.");
  }
}

function mergeAndDeleteBranch() {
  try {
    console.log("🔄 Mencoba merge langsung...");
    execSync(`gh pr merge --merge --delete-branch`, { stdio: "inherit" });
    console.log("✅ PR berhasil di-merge dan branch dihapus");
  } catch (err) {
    console.log("⚠️ Merge langsung gagal. Mencoba fallback ke auto-merge...");
    try {
      execSync(`gh pr merge --merge --delete-branch --auto`, {
        stdio: "inherit",
      });
      console.log(
        "✅ Auto-merge berhasil diaktifkan. PR akan merge setelah semua syarat terpenuhi."
      );
    } catch (err2) {
      console.log(
        "❌ Gagal mengaktifkan auto-merge. Periksa branch protection atau permissions."
      );
    }
  }
}

// ---------------- Issue Bot ----------------
function initIssueTracking() {
  if (!fs.existsSync(ISSUE_TRACKING_FILE)) {
    fs.writeFileSync(
      ISSUE_TRACKING_FILE,
      JSON.stringify({ count: 0, last_issue: null }, null, 2)
    );
  }
}

function updateIssueTracking() {
  const tracking = JSON.parse(fs.readFileSync(ISSUE_TRACKING_FILE, "utf-8"));
  tracking.count += 1;
  tracking.last_issue = new Date().toISOString();
  fs.writeFileSync(ISSUE_TRACKING_FILE, JSON.stringify(tracking, null, 2));
}

function createIssue() {
  const tracking = JSON.parse(fs.readFileSync(ISSUE_TRACKING_FILE, "utf-8"));
  const title = `Auto Issue #${tracking.count + 1} - ${new Date()
    .toISOString()
    .split("T")[0]}`;
  const body = `
🤖 Bot Auto Issue

- Waktu: ${new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  })}
- Issue ke-${tracking.count + 1}
- Status: Generated automatically by bot
`;

  try {
    execSync(`gh issue create --title "${title}" --body "${body}"`, {
      stdio: "inherit",
    });
    console.log("✅ Issue berhasil dibuat");
  } catch (err) {
    console.log("❌ Gagal membuat issue:", err.message);
  }
}

// ---------------- Main Runner ----------------
(async () => {
  // Commit & PR
  initTracking();
  updateTracking();
  updateDailyLog();
  await makeCommit();
  createPullRequest();
  mergeAndDeleteBranch();

  // Auto Issue
  initIssueTracking();
  createIssue();
  updateIssueTracking();
})();
