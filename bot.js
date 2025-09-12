// daily_bot.js
const { execSync } = require("child_process");

// ---------------- Variasi Commit Messages ----------------
const commitMessages = [
  "chore: update daily progress log",
  "docs: add routine activity record",
  "update: sync tracking & notes",
  "refactor: adjust workflow tracking",
  "fix: correct minor log detail",
  "style: tidy daily report format",
  "feat: add today’s progress entry",
  "build: refresh automated update",
  "ci: push scheduled commit log",
  "perf: streamline daily record",
  "progress: document latest activity",
  "log: append routine status update"
];
function getRandomCommitMessage() {
  return commitMessages[Math.floor(Math.random() * commitMessages.length)];
}

// ---------------- Variasi PR Titles ----------------
const prTitles = [
  "🚀 Daily Progress & Sync Report",
  "📊 Routine Workflow Update",
  "📝 Automated Log & Commit Batch",
  "✅ Task Tracking & Daily Record",
  "📌 Development Activity Report",
  "🔄 System Sync & Tracking Notes",
  "📒 Daily Development Snapshot",
  "⚡ Workflow Health Check",
  "📈 Progress Summary & Updates",
  "🔔 Routine Commit & Log Entry"
];
function getRandomPrTitle() {
  return prTitles[Math.floor(Math.random() * prTitles.length)];
}

// ---------------- Variasi PR Bodies ----------------
const prBodies = [
  `## 📌 Daily Update
Laporan otomatis untuk progress harian:

- ⏱️ Waktu update: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
- 📂 Semua commit sudah dicatat
- ✅ Workflow berjalan lancar

_Dibuat otomatis oleh Smart Bot_`,

  `## 📊 Progress Report
Ringkasan aktivitas:

1. Commit harian sudah disinkronkan
2. Catatan log diperbarui
3. Semua task tracking berhasil

⏰ ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,

  `## 📝 Development Log
Update otomatis hari ini:

- 📌 Data commit terbaru masuk
- 📊 Tracking status disimpan
- 🔄 Issue & PR dibuat otomatis`
];
function getRandomPrBody() {
  return prBodies[Math.floor(Math.random() * prBodies.length)];
}

// ---------------- Variasi Issue Titles ----------------
const issueTitles = [
  "Daily Progress Report",
  "Routine Update Log",
  "Task Tracking Record",
  "Automated Status Note",
  "Workflow Activity Log",
  "System Daily Report",
  "Development Progress Entry",
  "Automated Bot Update"
];
function getRandomIssueTitle() {
  return issueTitles[Math.floor(Math.random() * issueTitles.length)];
}

// ---------------- Variasi Issue Bodies ----------------
function getRandomIssueBody(count) {
  const bodies = [
    `## 📌 Daily Report
Progress tracking otomatis dicatat.

- 🔢 Issue ke-${count}
- ⏱️ ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
- 📂 Commit & log berhasil diperbarui`,

    `## 📊 Routine Log
Laporan update otomatis:
- Commit harian sukses
- File tracking diperbarui
- Nomor log: ${count}

_Dibuat otomatis oleh bot_`,

    `## 📝 Status Update
Halo, ini catatan otomatis:
1. Progress harian tercatat
2. Commit log diperbarui
3. Issue ke-${count} dibuat sebagai dokumentasi`,

    `## 🔄 Workflow Tracking
Detail update:
- 🔢 Issue ID: ${count}
- 📅 Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
- ✅ Semua tracking berjalan lancar`
  ];
  return bodies[Math.floor(Math.random() * bodies.length)];
}

// ---------------- Fungsi Bot ----------------
const BRANCH_NAME = "daily-bot-update";
const BASE_BRANCH = "main";

function run(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// Commit & Push
function makeCommit() {
  const msg = getRandomCommitMessage();
  run(`git add .`);
  run(`git commit -m "${msg}" || echo "⚠️ Tidak ada perubahan untuk commit"`);
  run(`git push origin ${BASE_BRANCH}`);
  console.log("✅ Commit berhasil dengan pesan:", msg);
}

// Create Issue
function createIssue(count = 1) {
  const title = getRandomIssueTitle();
  const body = getRandomIssueBody(count);
  run(`gh issue create --title "${title}" --body "${body}"`);
  console.log("✅ Issue dibuat:", title);
}

// Create Pull Request
function createPullRequest() {
  const title = getRandomPrTitle();
  const body = getRandomPrBody();
  try {
    run(
      `gh pr create --base ${BASE_BRANCH} --head ${BRANCH_NAME} --title "${title}" --body "${body}"`
    );
    console.log("✅ PR berhasil dibuat:", title);
  } catch (err) {
    console.log("ℹ️ PR mungkin sudah ada, atau GitHub CLI belum login.");
  }
}

// ---------------- Jalankan Bot ----------------
makeCommit();
createIssue(Math.floor(Math.random() * 1000));
createPullRequest();
