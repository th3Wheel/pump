# pump

ESP32-based water pump controller managed with [ESPHome](https://esphome.io).

[![CI](https://github.com/th3Wheel/pump/actions/workflows/ci.yml/badge.svg)](https://github.com/th3Wheel/pump/actions/workflows/ci.yml)

---

## Repository layout

```
pump/
├── devices/          # One YAML file per physical device
├── packages/         # Reusable config fragments (wifi, common sensors, …)
├── components/       # Custom ESPHome external components
├── scripts/          # Helper shell scripts
├── docs/             # Project documentation
├── .devcontainer/    # GitHub Codespaces / VS Code Dev Container
└── .github/workflows # CI: YAML lint + ESPHome validate + compile
```

See [docs/STRUCTURE.md](docs/STRUCTURE.md) for a full description of each folder.

---

## Quick start

### Prerequisites

- [ESPHome](https://esphome.io/guides/installing_esphome.html) (`pip install esphome`)
- [1Password CLI](https://developer.1password.com/docs/cli/get-started/) (`op`)

### 1. Clone and set up secrets

```bash
git clone https://github.com/th3Wheel/pump.git
cd pump

# Pull secrets from 1Password into the git-ignored secrets.yaml
op inject -i secrets.yaml.tpl -o secrets.yaml
```

See [docs/SECRETS.md](docs/SECRETS.md) for vault layout and CI setup.

### 2. Validate a config

```bash
esphome config devices/pump-controller.yaml
```

### 3. Compile firmware

```bash
esphome compile devices/pump-controller.yaml
```

### 4. Flash to device

```bash
esphome run devices/pump-controller.yaml
```

---

## GitHub Codespaces

Click **Code → Codespaces → Create codespace** to spin up a pre-configured
ESPHome environment with the 1Password CLI included. After the container
starts, run:

```bash
op inject -i secrets.yaml.tpl -o secrets.yaml
esphome dashboard .
```

---

## CI / CD

GitHub Actions runs on every push and PR to `main`, `develop`, and `release/**`:

| Job | What it does |
|-----|-------------|
| `lint` | Runs `yamllint` over all YAML files |
| `validate` | Runs `esphome config` for each device config |
| `compile` | Runs `esphome compile` for each device config |

Secrets are injected at runtime via the
[1password/load-secrets-action](https://github.com/1password/load-secrets-action).
No plaintext credentials are stored in GitHub. See [docs/SECRETS.md](docs/SECRETS.md).

---

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Commits follow
[Conventional Commits](https://www.conventionalcommits.org/).

---

## Devices

| Config | Documentation |
|--------|---------------|
| [`esphome/pool_pump.yaml`](esphome/pool_pump.yaml) | [docs/POOL_PUMP.md](docs/POOL_PUMP.md) — Century VGreen RS485 pool pump controller |
| [`devices/pump-controller.yaml`](devices/pump-controller.yaml) | Example ESP32 pump controller using the `devices/` + `packages/` layout |

