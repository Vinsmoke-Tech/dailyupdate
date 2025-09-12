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
      console.log("✅ Auto-merge berhasil diaktifkan.");
    } catch (err2) {
      console.log("❌ Gagal auto-merge. Cek branch protection.");
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

function createAndCloseIssue() {
  const issueTracking = JSON.parse(fs.readFileSync(ISSUE_TRACKING_FILE, "utf-8"));
  const commitTracking = JSON.parse(fs.readFileSync(TRACKING_FILE, "utf-8"));

  const title = `Auto Issue #${issueTracking.count + 1} - ${new Date()
    .toISOString()
    .split("T")[0]}`;

  const body = `
🤖 **Bot Auto Issue Report**

- 📅 Waktu: ${new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  })}
- 🔢 Issue ke-${issueTracking.count + 1}
- 📊 Total commit: ${commitTracking.count}
- ⏱️ Last commit: ${commitTracking.last_commit}

_Status: Generated automatically by bot_
`;

  try {
    // buat issue
    execSync(`gh issue create --title "${title}" --body "${body}"`, {
      stdio: "inherit",
    });
    console.log(`✅ Issue berhasil dibuat`);

    // ambil issue terakhir (open) dan langsung close
    const latest = execSync(
      `gh issue list --state open --limit 1 --json number --jq ".[0].number"`,
      { encoding: "utf-8" }
    ).trim();

    if (latest) {
      execSync(`gh issue close ${latest}`, { stdio: "inherit" });
      console.log(`🛑 Issue #${latest} langsung ditutup`);
    }
  } catch (err) {
    console.log("❌ Gagal membuat/menutup issue:", err.message);
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

    // Auto Issue (buat + auto close)
    initIssueTracking();
    createAndCloseIssue();
    updateIssueTracking();
})();
