# Copilot Instructions for This Repository

## Project Overview

This is an **ESPHome** project for a smart pool pump controller. It interfaces with a **Century VGreen pool pump** via Modbus (RS485), monitors filter pressure via an analog sensor, and integrates into **Home Assistant**. The hardware runs on an **M5Stack Atom S3** (ESP32-based) with a **Tail485** RS485 module, an SSD1306 OLED display, and a DS18B20 temperature sensor.

The entire codebase is a single YAML configuration file: [`esphome/pool_pump.yaml`](../esphome/pool_pump.yaml).

## Tech Stack

- **Language:** YAML (ESPHome configuration syntax)
- **Framework:** [ESPHome](https://esphome.io) (no custom C++ components)
- **Target hardware:** M5Stack Atom S3 (`esp32` board: `m5stack-atoms3`)
- **Integration:** Home Assistant (via ESPHome native API)

## Build & Flash

1. Install ESPHome:
   ```bash
   pip install esphome
   ```
2. Connect the Atom S3 via USB-C.
3. Flash the device:
   ```bash
   esphome run esphome/pool_pump.yaml
   ```
4. View logs only (without re-flashing):
   ```bash
   esphome logs esphome/pool_pump.yaml
   ```
5. Validate YAML without flashing:
   ```bash
   esphome config esphome/pool_pump.yaml
   ```

## Secrets

Sensitive values (WiFi credentials, API keys, OTA password) are stored in a `secrets.yaml` file at the repository root (the same directory that contains the `esphome/` folder), i.e., `./secrets.yaml`. This file is **not committed** to the repository. Reference secrets in YAML with `!secret <key>`. Required keys:

| Key | Purpose |
|-----|---------|
| `wifi_ssid` | WiFi network name |
| `wifi_password` | WiFi password |
| `ap_password` | Fallback AP hotspot password |
| `api_encryption_key` | Home Assistant API encryption key |
| `ota_password` | OTA update password |

**Never hard-code credentials in `pool_pump.yaml`.**

## Hardware Pin Assignments

| GPIO | Component | Notes |
|------|-----------|-------|
| GPIO5 | I2C SDA | SSD1306 OLED data |
| GPIO6 | I2C SCL | SSD1306 OLED clock |
| GPIO7 | ADC | Pressure sensor (via 10 kΩ/20 kΩ voltage divider) |
| GPIO8 | 1-Wire | DS18B20 temperature probe |
| GPIO26 | UART TX | Tail485 RS485 transmit |
| GPIO32 | UART RX | Tail485 RS485 receive |

The Tail485 module is hardwired to GPIO26/GPIO32 by the M5Stack connector—do not change these pins.

## Key Conventions

- **Substitutions block at the top:** `device_name` and `friendly_name` are defined there; reference them as `${device_name}` and `${friendly_name}` throughout the file.
- **Section comments:** Each major section (I2C, 1-Wire, UART/Modbus, Sensors, Binary Sensors, Display) is introduced with a header comment block using `# ---` dividers.
- **Sensor IDs:** Sensors that are referenced elsewhere (e.g., in binary sensor lambdas or the display lambda) must have an `id:` field. Sensors only consumed by Home Assistant do not require one.
- **Temperature unit:** The DS18B20 reports in °C. Apply `multiply: 1.8` then `offset: 32.0` filters to convert to °F before exposing the value.
- **Pressure sensor calibration:** The 10 kΩ resistor is in series between the sensor output and GPIO7; the 20 kΩ resistor is a pull-down from GPIO7 to GND. This gives a voltage divider ratio of 20/(10+20) = 0.667, so the GPIO reads 0.33–3.0 V for a sensor range of 0.5–4.5 V. The `multiply: 1.5` filter (= 1/0.667) restores the original sensor voltage before the `calibrate_linear` mapping.
- **Modbus address:** The pump controller uses Modbus address `0x01`. RPM is register `0x0003`, power is register `0x0004`.

## Important Files

| Path | Purpose |
|------|---------|
| `esphome/pool_pump.yaml` | The sole ESPHome configuration (all firmware logic) |
| `secrets.yaml` | Local-only secrets file (gitignored) |
| `README.md` | Hardware wiring diagrams, installation instructions, and project goals |

## What Not to Change

- **Do not modify** GPIO26/GPIO32 (Tail485 UART) — hardwired by the Atom S3/Tail485 connector.
- **Do not hard-code** any credentials or API keys; always use `!secret`.
- **Do not add** custom C++ components or `esphome: includes:` unless strictly necessary — prefer native ESPHome components and lambda expressions.
- **Do not remove** the `captive_portal:` component — it is required for fallback Wi-Fi configuration.
