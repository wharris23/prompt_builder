# ⚡ Prompt Compiler

A lightweight menu bar app that transforms your simple prompts into optimized, structured prompts for LLMs like ChatGPT and Claude.

**Zero API calls. 100% local. Unlimited free uses.**

## ✨ Features

- 🖥️ **Menu bar app** – Lives in your system tray (macOS/Windows/Linux)
- ⌨️ **Global shortcut** – Press `⌘+Shift+P` (Mac) or `Ctrl+Shift+P` (Win/Linux) from anywhere
- 🎯 **Smart intent detection** – Auto-detects coding, explanation, creative, or analysis prompts
- 📋 **One-click copy** – Optimized prompt copied to clipboard instantly
- 🔒 **100% offline** – No API keys, no data sent anywhere
- ⚡ **Instant** – <1ms processing time

## 📥 Installation

### Download Pre-built Binaries

Go to [Releases](https://github.com/wharris23/prompt_builder/releases) and download for your platform:

| Platform | File |
|Data | |
| **macOS** | `Prompt.Compiler-x.x.x-universal.dmg` |
| **Windows** | `Prompt.Compiler-x.x.x-Setup.exe` or `Prompt.Compiler-x.x.x-portable.exe` |
| **Linux** | `Prompt.Compiler-x.x.x.AppImage` or `.deb` |

### macOS Note

Since the app isn't signed, you'll need to:

1. Right-click the `.app` → **Open**
2. Click **Open** in the security dialog

### Build from Source

```bash
# Clone the repository
git clone https://github.com/wharris23/prompt_builder.git
cd prompt_builder

# Install dependencies
npm install

# Run in development mode
npm start

# Build for your platform
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

## 🚀 Usage

1. **Open the app** – Click the tray icon or press `⌘+Shift+P` / `Ctrl+Shift+P`
2. **Type your prompt** – Enter your basic prompt idea
3. **Select template** – Use auto-detect or manually choose (Coding, Explanation, Creative, Analysis)
4. **Copy & use** – Click Copy or press `⌘+Enter` / `Ctrl+Enter`, then paste into ChatGPT/Claude

### Example

**Your input:**

> Create a calendar website with dark theme

**Optimized output:**

```
You are an expert software engineer. Help me build the following.

## Instructions
- Think step-by-step before writing code
- Consider edge cases and error handling
- Provide clear, well-commented code
- Use modern best practices

## Request
Create a calendar website with dark theme

## Expected Response
1. **Plan**: Outline your approach
2. **Implementation**: Complete, working code
3. **Explanation**: Key decisions explained
4. **Next Steps**: What to do after
```

## 🎨 Templates

| Template | Use Case |
| --- | --- |
| 💻 **Coding** | Programming, debugging, building apps |
| 📚 **Explanation** | Learning concepts, understanding how things work |
| ✨ **Creative** | Writing stories, poems, creative content |
| 🔍 **Analysis** | Evaluating options, pros/cons, decision making |
| � **General** | Everything else |

## ⌨️ Keyboard Shortcuts

| Action | macOS | Windows/Linux |
| --- | --- | --- |
| Toggle window | `⌘+Shift+P` | `Ctrl+Shift+P` |
| Copy output | `⌘+Enter` | `Ctrl+Enter` |
| Close window | `Escape` | `Escape` |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development
npm start

# Build all platforms (requires appropriate OS or CI)
npm run build
```

## 📦 Project Structure

```
prompt_builder/
├── electron/
│   ├── main.js        # Electron main process (tray, window)
│   └── preload.js     # IPC bridge
├── src/
│   ├── classifier.js  # Intent detection (regex/keyword)
│   ├── templates.js   # Prompt templates
│   └── transformer.js # Transformation pipeline
├── popup.html         # Popup UI
├── popup.css          # Styling
├── popup.js           # UI logic (bundled)
└── package.json       # Config & dependencies
```

## 📄 License

MIT © Wyatt Harris
