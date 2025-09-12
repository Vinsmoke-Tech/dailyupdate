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

// ---------------- Variasi Commit Messages ----------------
const commitMessages = [
  "chore: daily progress update",
  "docs: refresh daily log",
  "refactor: routine update",
  "update: tracking & daily note",
  "fix: minor log adjustment",
  "style: tidy up daily report",
  "feat: add today’s progress entry",
  "build: sync daily update",
  "ci: automated daily commit",
  "perf: optimize daily record update"
];
function getRandomCommitMessage() {
  return commitMessages[Math.floor(Math.random() * commitMessages.length)];
}

// ---------------- Variasi Issue Titles ----------------
const issueTitles = [
  "Daily Progress Report",
  "Routine Update Log",
  "Automated Task Tracker",
  "Bot Report: Daily Status",
  "Update Summary",
  "Daily Notes & Check-in",
  "System Activity Log",
  "Auto-generated Progress Record"
];
function getRandomIssueTitle() {
  return issueTitles[Math.floor(Math.random() * issueTitles.length)];
}

// ---------------- Variasi Issue Bodies ----------------
function getRandomIssueBody(count) {
  const bodies = [
    `📌 Routine log update\n\n- Entry number: ${count}\n- Generated at ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
    `📝 Daily progress recorded\n\nCommit & update summary.\nIssue #${count}`,
    `🤖 Automated check-in\n\nThis issue documents today’s activities.\nRef: ${count}`,
    `📊 Status update\n\n- Issue count: ${count}\n- Time: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
    `✅ Bot created daily tracker\n\nLog ID: ${count}\nTime: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`
  ];
  return bodies[Math.floor(Math.random() * bodies.length)];
}

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
  await git.commit(getRandomCommitMessage());
  await git.push("origin", BRANCH_NAME, { "--force": null });
  console.log(`✅ Commit & push sukses ke branch ${BRANCH_NAME}`);
}

function createPullRequest() {
const titles = [
  "Routine Progress Sync",
  "Automated Report & Commit Log",
  "Task Update Summary",
  "Codebase Health Check",
  "Daily Workflow Log",
  "Progress Report & Daily Sync",
  "Update: Latest Work & Adjustments",
  "System Activity Log & Changes",
  "Daily Development Snapshot",
  "Routine Commit Batch",
  "Changelog & Activity Summary",
  "Update Report: Code & Progress",
  "Daily Log of Work Done",
  "Workflow Update & Refactor Notes",
  "Progress Sync – Ongoing Development",
  "Daily Push: Tracking & Notes",
  "Commit Digest & Update Summary",
  "End of Day Report & Commits",
  "Automated Daily Changelog",
  "Update – Routine Maintenance & Progress",
  "Quick Sync: Daily Updates",
  "Repo Activity Report",
  "Tracking Progress & Daily Notes",
  "Development Activity Summary",
  "Fixing Function"
];

    const bodies = [
    `## 📊 Daily Progress Report
    Halo team, ini update otomatis untuk hari ini:

    - 🔄 Commit log sudah diperbarui
    - 📝 Progress tracking tercatat
    - 📅 Waktu eksekusi: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}

    _Semua data di-generate otomatis oleh bot._`,

    `## 🔔 Routine Update
    PR ini dibuat secara otomatis untuk menjaga tracking harian.

    Detail:
    - Commit terbaru telah di-push
    - File tracking & log diperbarui
    - Branch \`${BRANCH_NAME}\` disinkronkan dengan \`${BASE_BRANCH}\`

    Terima kasih 🙌`,

    `## 📌 Automated Commit Log
    Berikut ringkasan update otomatis:

    1. Progress harian sudah tercatat
    2. Commit & file log berhasil ditambahkan
    3. Branch dilacak dan PR otomatis dibuat

    _Ini membantu memastikan workflow tetap terdokumentasi._`,

    `## 📒 Task Update Summary
    Update otomatis oleh bot:
    - 🔧 Tracking file diperbarui
    - 📑 Catatan harian ditambahkan
    - 🚀 PR dibuat untuk merge ke \`${BASE_BRANCH}\`

    PR ini bisa langsung di-review & merge.`,

    `## 🗂 Codebase Daily Log
    Detail update otomatis:
    - ✅ File log diperbarui
    - 🔄 Branch \`${BRANCH_NAME}\` di-sync
    - 🕒 Timestamp update: ${new Date().toISOString()}

    Semua berjalan lancar.`,

    `## 📈 Workflow Report
    Ringkasan:
    - Tracking commit + daily log sukses diupdate
    - PR otomatis dibuat untuk menjaga dokumentasi
    - Progress ini bisa dipakai sebagai referensi audit ke depannya.

    🙏`
    ];


  const emojis = ["🚀", "📊", "🔥", "✅", "⚡", "📝", "🔄", "📌"];

  // random pick
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  const finalTitle = `${randomEmoji} ${randomTitle}`;

  try {
    execSync(
      `gh pr create --base ${BASE_BRANCH} --head ${BRANCH_NAME} --title "${finalTitle}" --body "${randomBody}"`,
      { stdio: "inherit" }
    );
    console.log(`✅ PR berhasil dibuat: ${finalTitle}`);
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
  const title = getRandomIssueTitle();
  const body = getRandomIssueBody(tracking.count + 1);

  try {
    execSync(`gh issue create --title "${title}" --body "${body}"`, {
      stdio: "inherit",
    });
    console.log("✅ Issue berhasil dibuat");
  } catch (err) {
    console.log("❌ Gagal membuat issue:", err.message);
  }
}

// ---------------- Close Issue Bot ----------------
function closeOldIssues(limit = 1) {
  try {
    const result = execSync(`gh issue list --state open --json number`, {
      encoding: "utf-8",
    });
    const issues = JSON.parse(result);

    if (issues.length === 0) {
      console.log("ℹ️ Tidak ada issue open untuk ditutup.");
      return;
    }

    const toClose = issues.slice(0, limit);
    for (const issue of toClose) {
      execSync(`gh issue close ${issue.number}`, { stdio: "inherit" });
      console.log(`✅ Issue #${issue.number} berhasil ditutup`);
    }
  } catch (err) {
    console.log("❌ Gagal menutup issue:", err.message);
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

  // Auto Close Issue (tutup 1 issue open tiap run)
  closeOldIssues(1);
})();
