# 🤖 Smart Daily Update Bot

Automated commit bot that maintains natural GitHub activity with intelligent randomization.

## ✨ Features

- **Smart Frequency**: 8–15 random commits per day
- **Auto Pull Requests**: Creates proper PR workflow for each commit
- **Dynamic Messages**: 20+ varied commit messages  
- **Natural Activity**: Simulates real development work
- **Intelligent Tracking**: Prevents spam and maintains realistic patterns
- **Timezone Aware**: All timestamps in WIB (Asia/Jakarta)
- **Clean Git History**: Auto-merge and branch cleanup

## 🔧 How It Works

1. **Workflow runs** every ~30-60 minutes during active hours (06:00–23:00 WIB)
2. **Bot decides** randomly whether to commit based on daily target (8–15 commits)
3. **Creates unique branch** for each commit activity
4. **Adds realistic activity** to `daily_update.txt` with varied descriptions
5. **Auto-creates Pull Request** via GitHub CLI with professional titles
6. **Auto-merges PR** and cleans up branches
7. **Tracks progress** in `commit_tracking.json` to maintain natural frequency

## 📊 Activity Types

The bot simulates various development activities:
- Code review sessions
- Feature development  
- Bug fixing
- Documentation updates
- Performance optimization
- Testing improvements
- Refactoring work
- Security enhancements
- UI/UX improvements
- Database optimization
- API development
- Deployment preparation

## 🎯 Smart Logic

- Daily target randomized between 8–15 commits
- 70% probability to commit when target not reached
- Automatic date reset and counter tracking
- Natural time distribution throughout the day
- **Professional PR workflow** with auto-merge
- **Branch management** with automatic cleanup
- **Fallback system** for manual merge if GitHub CLI fails

## 📈 Expected Results

- **Daily Frequency**: 8–15 commits per day (high activity)
- **Commit Rate**: ~30–55% of 27 workflow runs
- **GitHub Profile**: Consistent green squares with professional messages
- **Activity Logs**: Detailed development simulation in `daily_update.txt`
- **PR History**: Clean pull request workflow with auto-merge
- **Branch Management**: Automatic cleanup, no orphaned branches

## 🚀 Setup Instructions

1. **Push to GitHub** - All files to your repository
2. **Enable Actions** - Go to Actions tab and enable workflows
3. **Setup GitHub CLI** - Ensure `gh` CLI is available in runner
4. **Configure Tokens** - Set `GITHUB_TOKEN` or `GH_TOKEN` environment variable
5. **Manual Test** - Run workflow manually to verify setup
6. **Monitor** - Check Actions tab, commit history, and PR activity

## 📱 Monitoring

- **Actions Tab**: View workflow runs and success/failure rates
- **Pull Requests**: Monitor auto-created PRs and merge activity
- **`daily_update.txt`**: Detailed activity logs with timestamps
- **`commit_tracking.json`**: Daily progress tracking

## ⚙️ Customization

### Change Commit Frequency
Edit `bot.js` line 53:
```javascript
targetCommits: Math.floor(Math.random() * 8) + 8 // 8–15 commits
// Change to: Math.floor(Math.random() * 5) + 10 // 10–14 commits
```

### Add Commit Messages
Edit `commitMessages` array in `bot.js` lines 8-28

### Modify Schedule
Edit `.github/workflows/daily.yml` cron schedules

## 🔧 Auto PR System

### **Pull Request Format**
- **Title**: `[Auto] {commit-message}`
- **Body**: `Automated PR for {activity}`
- **Branch**: `auto/{activity}-{timestamp}`

### **Workflow Process**
1. Create unique branch per commit
2. Auto-create PR via GitHub CLI
3. Auto-merge with `--merge --delete-branch`
4. Fallback to manual merge if needed
5. Clean up branches automatically

### **Requirements**
- GitHub CLI (`gh`) installed in runner
- `GITHUB_TOKEN` or `GH_TOKEN` environment variable
- Repository write permissions

---
*Maintaining consistent GitHub contributions with intelligent automation* 🚀

**Current Configuration**: 8–15 commits/day | 27 scheduled runs | Auto PR workflow | Smart frequency control