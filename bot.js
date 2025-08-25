// daily_update_bot.js
const fs = require('fs');
const simpleGit = require('simple-git');
const { execSync } = require('child_process');

const git = simpleGit();

// Konfigurasi
const TRACKING_FILE = 'commit_tracking.json';
const DAILY_FILE = 'daily_update.txt';
const BRANCH_NAME = 'auto/daily-update';
const BASE_BRANCH = 'main'; // branch target PR

// Inisialisasi file tracking
function initTracking() {
    if (!fs.existsSync(TRACKING_FILE)) {
        fs.writeFileSync(
            TRACKING_FILE,
            JSON.stringify({ count: 0, last_commit: null }, null, 2)
        );
    }
}

// Update data tracking
function updateTracking() {
    const tracking = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'));
    tracking.count         += 1;
    tracking.targetCommits += 1;
    tracking.last_commit = new Date().toISOString();
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(tracking, null, 2));
}

// Update daily log
function updateDailyLog() {
    const logLine = `${new Date().toISOString()} - Daily update completed\n`;
    fs.appendFileSync(DAILY_FILE, logLine);
}

// Commit & push perubahan
async function makeCommit() {
    const branches = await git.branchLocal();
    if (!branches.all.includes(BRANCH_NAME)) {
        await git.checkoutLocalBranch(BRANCH_NAME);
    } else {
        await git.checkout(BRANCH_NAME);
    }

    await git.add([TRACKING_FILE, DAILY_FILE]);
    await git.commit(`Daily update & progress tracking - ${new Date().toISOString()}`);
    await git.push('origin', BRANCH_NAME, { '--force': null });
    console.log(`✅ Commit & push sukses ke branch ${BRANCH_NAME}`);
}

// Buat PR otomatis
function createPullRequest() {
    try {
        execSync(
            `gh pr create --base ${BASE_BRANCH} --head ${BRANCH_NAME} --title "Daily Update & Progress Tracking" --body "Automated daily update & commit tracking."`,
            { stdio: 'inherit' }
        );
        console.log('✅ PR berhasil dibuat');
    } catch (err) {
        console.log('ℹ️ PR mungkin sudah ada, atau GitHub CLI belum login.');
    }
}

// Merge PR otomatis & hapus branch (dengan fallback auto-merge)
function mergeAndDeleteBranch() {
    try {
        console.log('🔄 Mencoba merge langsung...');
        execSync(
            `gh pr merge --merge --delete-branch`,
            { stdio: 'inherit' }
        );
        console.log('✅ PR berhasil di-merge dan branch dihapus');
    } catch (err) {
        console.log('⚠️ Merge langsung gagal. Mencoba fallback ke auto-merge...');
        try {
            execSync(
                `gh pr merge --merge --delete-branch --auto`,
                { stdio: 'inherit' }
            );
            console.log('✅ Auto-merge berhasil diaktifkan. PR akan merge setelah semua syarat terpenuhi.');
        } catch (err2) {
            console.log('❌ Gagal mengaktifkan auto-merge. Periksa branch protection atau permissions.');
        }
    }
}

// Buat PR batch: hanya 10 per run
async function bulkPullRequestsBatch(limit = 10) {
    const branches = await git.branch(['-r']); // ambil remote branches
    const branchList = branches.all
        .map(b => b.replace('origin/', ''))
        .filter(b => b !== BASE_BRANCH && !b.startsWith('HEAD'));

    console.log(`🔎 Total branch ditemukan: ${branchList.length}`);

    // Simpan state progress agar tahu batch terakhir
    const STATE_FILE = 'bulk_pr_state.json';
    let state = { index: 0 };

    if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }

    const start = state.index;
    const end = Math.min(start + limit, branchList.length);
    const batch = branchList.slice(start, end);

    console.log(`🚀 Membuat PR untuk branch ke-${start + 1} sampai ke-${end}`);

    for (const branch of batch) {
        try {
            console.log(`➡️ Membuat PR untuk branch: ${branch}`);
            execSync(
                `gh pr create --base ${BASE_BRANCH} --head ${branch} --title "Auto PR: ${branch}" --body "Automated PR dari branch ${branch} ke ${BASE_BRANCH}"`,
                { stdio: 'inherit' }
            );
        } catch (err) {
            console.log(`ℹ️ PR untuk ${branch} mungkin sudah ada atau gagal: ${err.message}`);
        }
    }

    // Simpan progress
    state.index = end;
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

    if (end >= branchList.length) {
        console.log("✅ Semua branch sudah diproses.");
    } else {
        console.log(`⏳ Batch selesai. Jalankan ulang script dalam 1 jam untuk lanjut batch berikutnya.`);
    }
}



// Jalankan proses
(async () => {
    initTracking();
    updateTracking();
    updateDailyLog();
    await makeCommit();
    createPullRequest();
    mergeAndDeleteBranch();
    // await bulkPullRequestsBatch(10);
})();