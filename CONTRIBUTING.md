# Contributing to Prompt Compiler

Thank you for your interest in contributing! 🎉

## Branch Strategy

We use a **simplified Git Flow** model:

```
main          ← Production releases only (tagged)
  │
  └── develop ← Integration branch (default for PRs)
        │
        └── feature/* ← Your feature branches
```

### Branch Types

| Branch      | Purpose                 | Created From | Merges Into          |
| ----------- | ----------------------- | ------------ | -------------------- |
| `main`      | Stable releases         | —            | —                    |
| `develop`   | Latest working code     | `main`       | `main` (via release) |
| `feature/*` | New features            | `develop`    | `develop`            |
| `bugfix/*`  | Bug fixes               | `develop`    | `develop`            |
| `hotfix/*`  | Urgent production fixes | `main`       | `main` + `develop`   |
| `release/*` | Pre-release prep        | `develop`    | `main` + `develop`   |

## Workflow

### 1. Create a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

### 2. Make Your Changes

- Write clear, commented code
- Follow existing code style
- Test your changes locally with `npm start`

### 3. Commit with Clear Messages

```bash
git add .
git commit -m "Add new template for data analysis prompts"
```

### 4. Push and Create PR

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request targeting `develop` on GitHub.

### 5. After PR is Merged

```bash
git checkout develop
git pull origin develop
git branch -d feature/my-new-feature
```

## Release Process

1. Create release branch: `git checkout -b release/v1.1.0 develop`
2. Bump version in `package.json`
3. Create PR to `main`
4. After merge, tag the release: `git tag v1.1.0 && git push origin v1.1.0`
5. Merge `main` back to `develop`

## Local Development

```bash
npm install    # Install dependencies
npm start      # Run in dev mode
npm run build  # Build for your platform
```

## Questions?

Open an issue or start a discussion on GitHub!
