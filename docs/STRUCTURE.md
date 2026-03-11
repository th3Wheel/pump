# Repository Structure

```
pump/
├── devices/               # Device-specific ESPHome YAML configs (one file per physical device)
│   └── pump-controller.yaml
├── packages/              # Reusable config fragments included by device configs
│   ├── common.yaml        # Logging, API, OTA, diagnostics, uptime sensors
│   └── wifi.yaml          # WiFi + captive-portal fallback
├── components/            # Custom ESPHome external components (C++ / Python)
│   └── .gitkeep
├── scripts/               # Helper shell scripts (flash, backup, etc.)
│   └── .gitkeep
├── docs/                  # Project documentation
│   ├── STRUCTURE.md       # This file
│   ├── SECRETS.md         # 1Password secrets setup
│   └── CONTRIBUTING.md    # Contribution guidelines
├── .devcontainer/
│   └── devcontainer.json  # GitHub Codespaces / VS Code Dev Container config
├── .github/
│   └── workflows/
│       └── ci.yml         # YAML lint + ESPHome validate + compile
├── .gitignore
├── .yamllint.yaml         # yamllint rules
├── secrets.yaml.tpl       # 1Password inject template (generates git-ignored secrets.yaml)
└── README.md
```

---

## Where files go

### `devices/`
One YAML file per physical device. Each file should:
- Set `substitutions` for `device_name`, `friendly_name`, etc.
- Pull in shared packages with `!include ../packages/<name>.yaml`.
- Contain only device-specific hardware configuration (pins, sensors, switches).

### `packages/`
Reusable YAML fragments. Keep them focused on one concern each (wifi, logging,
sensors, automations). Include them from device configs via:

```yaml
packages:
  wifi: !include ../packages/wifi.yaml
```

### `components/`
Custom [external components](https://esphome.io/components/external_components.html)
written in C++ or Python. Each component lives in its own subdirectory.

### `scripts/`
Utility shell scripts for tasks like mass-flashing, firmware backup, or
generating release changelogs. Scripts must be executable (`chmod +x`).

### `docs/`
Markdown documentation. New features should include a brief doc update.

---

## Adding a new device

1. Copy `devices/pump-controller.yaml` to `devices/<your-device>.yaml`.
2. Update `substitutions`, board type, and pin assignments.
3. Add the new config to the `matrix.config` list in `.github/workflows/ci.yml`.
4. Open a PR — CI will validate and compile the new config automatically.
