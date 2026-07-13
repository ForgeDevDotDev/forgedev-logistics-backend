## Description

<!-- What does this change do? Link any relevant issues. -->

## Type of Change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Feature / new functionality
- [ ] Refactor (no functional changes)
- [ ] Test coverage improvement
- [ ] Documentation improvement
- [ ] Performance improvement
- [ ] Security fix
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Motivation

<!-- Why is this change needed? What problem does it solve? -->

## How Was This Tested?

<!-- Describe how you verified your changes. Include test commands if applicable. -->

```bash
# Run tests
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## Checklist

- [ ] My code follows the existing style of the project (ESLint + Prettier pass)
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] TypeScript type checking passes (`tsc --noEmit`)
- [ ] I have not introduced new dependencies without discussion
- [ ] CLA signed (email info@forgedev.dev if not yet done)
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] PR is focused — one feature or fix per PR

## Breaking Changes

<!-- If breaking, describe what breaks and how to migrate. Delete this section if not applicable. -->

## Screenshots / Logs

<!-- If UI change or visual output, include before/after. Delete if not applicable. -->

---

**Note:** Some bugs and messiness in ForgeDev repos are intentional (training codebases). If you're unsure whether something is a real bug or by design, check existing issues or ask before opening a PR.
