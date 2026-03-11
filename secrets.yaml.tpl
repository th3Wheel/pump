# secrets.yaml.tpl
# 1Password inject template for ESPHome secrets.
#
# Usage (local dev):
#   op inject -i secrets.yaml.tpl -o secrets.yaml
#
# This generates secrets.yaml (git-ignored) by pulling values directly from
# your 1Password vault. Never commit secrets.yaml to source control.
#
# 1Password item layout expected (vault: pump):
#   Item "wifi"     → fields: ssid, password, fallback_ap_password
#   Item "esphome"  → fields: api_encryption_key, ota_password
#
# See docs/SECRETS.md for full setup instructions.

wifi_ssid: "{{ op://pump/wifi/ssid }}"
wifi_password: "{{ op://pump/wifi/password }}"
fallback_ap_password: "{{ op://pump/wifi/fallback_ap_password }}"
api_encryption_key: "{{ op://pump/esphome/api_encryption_key }}"
ota_password: "{{ op://pump/esphome/ota_password }}"
