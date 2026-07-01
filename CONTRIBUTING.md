# Contributing to ForgeDev Projects

**Thank you for your interest in contributing!** ForgeDev projects are dual-licensed open-source projects. This document explains how to contribute, what you get in return, and the rules of engagement.

---

## 📜 License Overview

All ForgeDev projects are dual-licensed:

| Version | License | Use Case |
|---------|---------|----------|
| Community | AGPL-3.0 | Free for personal and open-source use. If you run a modified version as a service, you must publish your modifications. |
| Commercial | Separate license | For organizations that want to use ForgeDev projects without AGPL obligations (private modifications, enterprise deployment, etc.) |

This model keeps the code open-source while enabling sustainable development through commercial licensing.

---

## ✅ Before You Contribute

### 1. Sign the CLA

All contributors must sign the [Contributor License Agreement (CLA)](./CLA.md) before their contributions can be merged.

The CLA grants ForgeDev the right to distribute your contributions under both the AGPL-3.0 community license and the commercial license. You retain ownership of your work.

**To sign:**
1. Read the [CLA](./CLA.md)
2. Email **info@forgedev.dev** with:
   - Your GitHub username
   - Your full name
   - A statement confirming you agree to the CLA: *"I have read and agree to the terms of the ForgeDev CLA v1.0."*

We'll confirm receipt and add you to the contributors list.

### 2. Check Existing Issues

Before starting work, check the [issue tracker](../../issues) for existing discussions. If your idea isn't listed, open a new issue and describe what you want to contribute.

### 3. Understand the Project Context

ForgeDev projects serve two purposes:
- **Training codebases** — real-world codebases for junior developers to practice on (messy by design, intentional bugs, tech debt)
- **Future products** — projects that may evolve into commercial products

Some bugs are intentional. Some messiness is by design. If you're unsure whether something is a real bug or intentional, ask in the issue.

---

## 🛠 How to Contribute

### Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Follow the existing code style** — each repo has ESLint + Prettier configured
3. **Write tests** for your changes where applicable
4. **Keep PRs focused** — one feature or fix per PR
5. **Write a clear PR description:**
   - What does this change do?
   - Why is it needed?
   - How was it tested?
   - Any breaking changes?
6. **Be ready for review** — your PR will be reviewed, and you may be asked to make changes

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add transaction pagination to account view
fix: correct date arithmetic in booking overlap check
refactor: extract validation logic from search endpoint
test: add integration tests for cart checkout flow
docs: update README with deployment instructions
```

### Branch Naming

```
feat/short-description
fix/short-description
refactor/short-description
docs/short-description
```

---

## 💰 Revenue Sharing

### How It Works

ForgeDev shares a portion of commercial license revenue with contributors. Here's how:

### Revenue Pool

- **20% of commercial license revenue** from each project goes to a contributor revenue pool for that project
- The pool is distributed quarterly based on contribution weight

### Contribution Weight

Contribution weight is calculated from merged PRs in the relevant quarter:

| Contribution Type | Weight |
|-------------------|--------|
| Bug fix (non-trivial) | 1 |
| Feature implementation | 3 |
| Performance improvement | 3 |
| Test coverage improvement | 2 |
| Documentation improvement | 1 |
| Code review contribution (substantial reviews) | 1 per 3 reviews |
| Security vulnerability report | 5 |

### Payout

- Minimum payout threshold: **€50** (smaller amounts accumulate until threshold is reached)
- Payouts via **PayPal or bank transfer**
- Contributors receive a quarterly statement with their share calculation

### Example

If a project generates €2,000 in commercial license revenue in a quarter:
- Revenue pool: €400 (20%)
- 3 contributors with weights 5, 3, and 2 (total: 10)
- Contributor 1 (weight 5): €200
- Contributor 2 (weight 3): €120
- Contributor 3 (weight 2): €80

---

## 🧪 Code Quality Standards

### Required

- **Tests:** New features must include tests. Bug fixes should include a test that reproduces the bug.
- **Types:** All code must pass TypeScript type checking (`tsc --noEmit`).
- **Linting:** Code must pass ESLint and Prettier checks.
- **No new dependencies** without discussion in the PR. We keep dependency bloat minimal.

### Not Required

- Perfection. These projects are training codebases — some imperfection is intentional.
- 100% test coverage. Focus on meaningful tests, not coverage metrics.

---

## 🐛 Reporting Bugs

### Real Bugs

Open an issue with:
1. **Title:** Clear, concise description of the bug
2. **Description:** What happened vs. what you expected
3. **Reproduction steps:** Minimal steps to reproduce
4. **Environment:** OS, Node version, browser (if applicable)
5. **Screenshots/logs:** If helpful

### Security Vulnerabilities

**Do not open a public issue for security vulnerabilities.** Email **info@forgedev.dev** with:
- Description of the vulnerability
- Affected component(s)
- Reproduction steps
- Suggested fix (if any)

We will acknowledge within 48 hours and work with you on a fix and disclosure timeline.

---

## 💬 Communication

- **Issues:** For bugs, feature requests, and project discussions
- **Email:** info@forgedev.dev for CLA signing, security reports, and private matters
- **Pull Requests:** For code contributions and review discussions

---

## 📁 Project Structure

Each ForgeDev project follows this structure:

```
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Project documentation
├── CLA.md            # Contributor License Agreement (link)
├── CONTRIBUTING.md   # This file
├── LICENSE           # AGPL-3.0
├── README.md         # Project README
└── COMMERCIAL-LICENSE.md  # Commercial license terms
```

---

## ❓ FAQ

### Can I use ForgeDev projects for my own commercial product?

Yes, under two options:
1. **AGPL-3.0:** Free, but you must open-source any modifications you make and distribute (including network services)
2. **Commercial license:** Paid, no open-source obligations — contact info@forgedev.dev

### Can I fork a ForgeDev project?

Yes, under the AGPL-3.0 terms. Your fork must also be AGPL-3.0.

### Do I need to sign the CLA for a small fix?

Yes. All merged contributions require a signed CLA. This protects the project and all users.

### What if my employer doesn't allow me to sign the CLA?

You must have your employer's authorization before contributing. If your employer restricts contributions, you cannot contribute until that is resolved.

### How is revenue sharing calculated if I contribute to multiple projects?

Each project has its own revenue pool. Your share is calculated per-project based on your contributions to that specific project.

---

## 🙏 Recognition

All contributors are listed in the project's README and contributors page. Your contributions — whether code, docs, bug reports, or reviews — make these projects better.

---

**Questions?** Email **info@forgedev.dev**

**ForgeDev** — https://forgedev.dev
