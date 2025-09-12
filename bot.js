// daily_bot.js
const fs = require("fs");
const { execSync } = require("child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

// ================== CONFIG ==================
const TRACKING_FILE = "commit_tracking.json";
const ISSUE_TRACKING_FILE = "issue_tracking.json";
const DAILY_FILE = "daily_update.txt";
const BRANCH_NAME = "daily-bot-update";
const BASE_BRANCH = "main";
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
  "perf: optimize daily record update",
  "log: append daily progress line",
  "track: update counter & log",
  "meta: daily housekeeping",
  "report: sync with daily workflow",
  "note: update daily report file"
];
function getRandomCommitMessage() {
  return commitMessages[Math.floor(Math.random() * commitMessages.length)];
}

// ---------------- Variasi Issue ----------------
const issueTitles = [
  "Daily Progress Report",
  "Routine Update Log",
  "Automated Task Tracker",
  "Bot Report: Daily Status",
  "Update Summary",
  "Daily Notes & Check-in",
  "System Activity Log",
  "Auto-generated Progress Record",
  "Work Log Snapshot",
  "Progress Sync Note"
];
function getRandomIssueTitle() {
  return issueTitles[Math.floor(Math.random() * issueTitles.length)];
}

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

// ---------------- Variasi PR ----------------
const prTitles = [
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
  "Development Activity Summary"
];

const prBodies = [
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

function getRandomPrTitle() {
  const emojis = ["🚀", "📊", "🔥", "✅", "⚡", "📝", "🔄", "📌"];
  return `${emojis[Math.floor(Math.random() * emojis.length)]} ${
    prTitles[Math.floor(Math.random() * prTitles.length)]
  }`;
}
function getRandomPrBody() {
  return prBodies[Math.floor(Math.random() * prBodies.length)];
}

// ---------------- Tracking ----------------
function initTracking(file, defaultValue) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
  }
}

function updateTracking(file, key) {
  const tracking = JSON.parse(fs.readFileSync(file, "utf-8"));
  tracking.count += 1;
  tracking[key] = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(tracking, null, 2));
  return tracking.count;
}

// ---------------- Core Logic ----------------
async function prepareBranch() {
  run(`git checkout ${BASE_BRANCH}`);
  run(`git pull origin ${BASE_BRANCH}`);
  run(`git checkout -B ${BRANCH_NAME}`);

  fs.appendFileSync(
    DAILY_FILE,
    `${new Date().toISOString()} - auto update\n`
  );
  run(`git add ${DAILY_FILE}`);
  try {
    run(`git commit -m "${getRandomCommitMessage()}"`);
  } catch {
    console.log("ℹ️ Tidak ada perubahan baru untuk commit.");
  }
  run(`git push origin ${BRANCH_NAME} --force`);
}

function createPullRequest() {
  const title = getRandomPrTitle();
  const body = getRandomPrBody();
  try {
    run(
      `gh pr create --base ${BASE_BRANCH} --head ${BRANCH_NAME} --title "${title}" --body "${body}"`
    );
    console.log(`✅ PR berhasil dibuat: ${title}`);
  } catch {
    console.log("ℹ️ PR mungkin sudah ada.");
  }
}

function mergeAndDeleteBranch() {
  try {
    run(`gh pr merge --merge --delete-branch`);
    console.log("✅ PR berhasil di-merge & branch dihapus");
  } catch {
    console.log("⚠️ Merge manual gagal, coba auto-merge...");
    try {
      run(`gh pr merge --merge --delete-branch --auto`);
      console.log("✅ Auto-merge diaktifkan");
    } catch {
      console.log("❌ Auto-merge gagal (cek branch protection).");
    }
  }
}

function createIssue(count) {
  const title = getRandomIssueTitle();
  const body = getRandomIssueBody(count);
  try {
    run(`gh issue create --title "${title}" --body "${body}"`);
    console.log("✅ Issue berhasil dibuat");
  } catch (err) {
    console.log("❌ Gagal membuat issue:", err.message);
  }
}

function closeOldIssues(limit = 1) {
  try {
    const result = execSync(`gh issue list --state open --json number`, {
      encoding: "utf-8"
    });
    const issues = JSON.parse(result);
    const toClose = issues.slice(0, limit);
    for (const issue of toClose) {
      run(`gh issue close ${issue.number}`);
      console.log(`✅ Issue #${issue.number} ditutup`);
    }
  } catch {
    console.log("ℹ️ Tidak ada issue open untuk ditutup.");
  }
}

// ---------------- Main Runner ----------------
(async () => {
  // Commit + PR + Merge
  initTracking(TRACKING_FILE, { count: 0, last_commit: null });
  await prepareBranch();
  createPullRequest();
  mergeAndDeleteBranch();
  updateTracking(TRACKING_FILE, "last_commit");

  // Issue create + close
  initTracking(ISSUE_TRACKING_FILE, { count: 0, last_issue: null });
  const count = updateTracking(ISSUE_TRACKING_FILE, "last_issue");
  createIssue(count);
  closeOldIssues(1);
})();
