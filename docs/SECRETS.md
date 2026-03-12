# Secrets Management

All sensitive values (WiFi credentials, ESPHome API keys, OTA passwords) are
managed through **1Password** and are **never** committed to the repository.

---

## 1Password vault layout

Create a vault named **`homelab`** in your 1Password account with the following
items and fields:

| Item | Field | ESPHome secret key(s) | Description |
|------|-------|-----------------------|-------------|
| `securewifi` | `ssid` | `wifi_ssid` | WiFi network name |
| `securewifi` | `password` | `wifi_password` | WiFi password |
| `securewifi` | `fallback_ap_password` | `ap_password`, `fallback_ap_password` | Fallback access-point password |
| `esphome` | `api_encryption_key` | `api_encryption_key` | 32-byte base64 ESPHome API key |
| `esphome` | `ota_password` | `ota_password` | Over-the-air update password |

### Generating an API encryption key

```bash
python3 -c "import secrets, base64; print(base64.b64encode(secrets.token_bytes(32)).decode())"
```

---

## Local development

### Prerequisites

- [1Password CLI (`op`)](https://developer.1password.com/docs/cli/get-started/) — install and sign in.

### Generate `secrets.yaml`

```bash
op inject -i secrets.yaml.tpl -o secrets.yaml
```

`secrets.yaml` is git-ignored. Regenerate it any time credentials change.

### Flash / validate a device

```bash
# Validate config (no hardware needed)
esphome config devices/pump-controller.yaml

# Compile firmware
esphome compile devices/pump-controller.yaml

# Upload to device (USB or OTA)
esphome run devices/pump-controller.yaml
```

---

## CI / GitHub Actions

The CI workflow uses the
[1password/install-cli-action](https://github.com/1password/install-cli-action)
to install the `op` CLI, then runs `op inject -i secrets.yaml.tpl -o secrets.yaml`
to generate `secrets.yaml` at runtime — no plaintext values are stored in GitHub.

### Required GitHub repository secret

| Secret name | Value |
|---|---|
| `OP_SERVICE_ACCOUNT_TOKEN` | A 1Password Service Account token with **read** access to the `homelab` vault |

### Creating a Service Account

1. Open 1Password → **Developer Tools → Service Accounts**.
2. Click **New Service Account**, name it `pump-ci`.
3. Grant it read access to the `homelab` vault (select the vault and choose the read-only permission).
4. Copy the token and add it to **GitHub → Settings → Secrets and variables →
   Actions** as `OP_SERVICE_ACCOUNT_TOKEN`.

### Secret references in the workflow

Secrets are referenced via `{{ op://vault/item/field }}` placeholders in
`secrets.yaml.tpl`. The `op inject` command resolves them at runtime using
the service account token:

```
op://homelab/securewifi/ssid
op://homelab/securewifi/password
op://homelab/securewifi/fallback_ap_password
op://homelab/esphome/api_encryption_key
op://homelab/esphome/ota_password
```

---

## Devcontainer (GitHub Codespaces)

The devcontainer includes the 1Password CLI. After the container starts:

1. Sign in: `op signin`
2. Generate secrets: `op inject -i secrets.yaml.tpl -o secrets.yaml`

Alternatively, configure the
[1Password GitHub Codespaces integration](https://developer.1password.com/docs/ci-cd/github-codespaces/)
to inject secrets automatically on container start.
