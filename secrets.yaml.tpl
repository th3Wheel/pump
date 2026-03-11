# secrets.yaml.tpl
# 1Password inject template for ESPHome secrets.
#
# Usage (local dev):
#   op inject -i secrets.yaml.tpl -o secrets.yaml
#
# This generates secrets.yaml (git-ignored) by pulling values directly from
# your 1Password vault. Never commit secrets.yaml to source control.
#
# 1Password item layout expected (vault: homelab):
#   Item "securewifi "     → fields: ssid, password, fallback_ap_password
#   Item "esphome"  → fields: api_encryption_key, ota_password
#
# See docs/SECRETS.md for full setup instructions.

securewifi_ssid: "{{ op://homelab/securewifi/ssid }}"
securewifi_password: "{{ op://homelab/securewifi/password }}"
fallback_ap_password: "{{ op://homelab/securewifi/fallback_ap_password }}"
api_encryption_key: "{{ op://homelab/esphome/api_encryption_key }}"
ota_password: "{{ op://homelab/esphome/ota_password }}"
