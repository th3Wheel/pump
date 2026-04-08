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
#   Item "securewifi" → fields: ssid, password, fallback_ap_password
#   Item "esphome"    → fields: api_encryption_key, ota_password
#
# See docs/SECRETS.md for full setup instructions.

# Standard WiFi keys used by all device configs and packages/wifi.yaml
wifi_ssid: "{{ op://homelab/securewifi/ssid }}"
wifi_password: "{{ op://homelab/securewifi/password }}"

# Fallback AP password — two key names are provided so both the legacy
# esphome/pool_pump.yaml (!secret ap_password) and the new packages/wifi.yaml
# (!secret fallback_ap_password) resolve to the same vault field.
ap_password: "{{ op://homelab/securewifi/fallback_ap_password }}"
fallback_ap_password: "{{ op://homelab/securewifi/fallback_ap_password }}"

# ESPHome API & OTA
api_encryption_key: "{{ op://homelab/esphome/api_encryption_key }}"
ota_password: "{{ op://homelab/esphome/ota_password }}"
