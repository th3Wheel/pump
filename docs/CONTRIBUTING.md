# Contributing

Thank you for contributing! Please follow the guidelines below.

---

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `test`.

Examples:
```
feat(devices): add garden-pump controller config
fix(packages): correct OTA platform key for ESPHome 2024.x
docs(secrets): clarify 1Password service account setup
ci: add garden-pump to compile matrix
```

---

## Workflow

1. Fork or clone the repo.
2. Create a feature branch from `main` (or `develop` if active):
   ```bash
   git checkout -b feat/my-feature
   ```
3. Set up secrets (see [docs/SECRETS.md](SECRETS.md)).
4. Make changes and validate locally:
   ```bash
   esphome config devices/<your-device>.yaml
   ```
5. Ensure YAML lint passes:
   ```bash
   yamllint -c .yamllint.yaml .
   ```
6. Commit using Conventional Commits and open a PR to `main`.

---

## CI checks

All PRs must pass:
- **lint** — `yamllint` over all YAML files.
- **validate** — `esphome config` for each device config.
- **compile** — `esphome compile` for each device config.

CI pulls secrets from 1Password via a service account; see [docs/SECRETS.md](SECRETS.md).

---

## Adding a new device config

See [docs/STRUCTURE.md](STRUCTURE.md#adding-a-new-device) for step-by-step instructions.
