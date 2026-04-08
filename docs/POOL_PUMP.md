# Century Pool Pump RS485 Interface & Monitoring

A low-profile, pump-powered controller that interfaces with a Century VGreen pool pump via Modbus (RS485) and provides real-time filter pressure monitoring. The system integrates into Home Assistant via ESPHome.

The ESPHome configuration is located at [`esphome/pool_pump.yaml`](../esphome/pool_pump.yaml).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Hardware Requirements](#hardware-requirements)
- [Wiring Architecture](#wiring-architecture)
- [Software Configuration](#software-configuration)
- [Physical Installation](#physical-installation)
- [Functional Goals](#functional-goals)

---

## Project Overview

The goal is to create a low-profile, pump-powered controller to interface with a Century VGreen pool pump via Modbus (RS485) and provide real-time filter pressure monitoring. The system will integrate into Home Assistant via ESPHome.

---

## Hardware Requirements

| Component | Specification | Purpose |
| --- | --- | --- |
| Controller | M5Stack Atom S3 | Main logic, built-in LCD, and WiFi/ESP-Now |
| RS485 Module | M5Stack Tail485 | RS485 transceiver and 12V-to-5V DC/DC regulator |
| Pressure Sensor | 0–30 PSI Transducer (5V, 3-wire) | Measures filter back-pressure (Analog 0.5V – 4.5V) |
| Resistors | 10 kΩ and 20 kΩ | Voltage divider to scale pressure sensor output for 3.3V GPIO |
| Resistor | 4.7 kΩ | Pull-up for DS18B20 1-Wire data line |
| Mini Breadboard | Half-size (400-tie or smaller) | Mounts display and temperature sensor breakout without soldering |
| OLED Display | SSD1306 0.96" 128×64 I2C | Local readout of PSI, temperature, and pump status |
| Temperature Sensor | DS18B20 Waterproof Probe | Measures water/ambient temperature near equipment pad |
| Fittings | 1/4" NPT Brass Street Tee | For mounting pressure sensor alongside existing manual gauge |

---

## Wiring Architecture

### A. Pump to Tail485 (Power & Data)

The Tail485 connects to the Century Pump's communication port. The pump provides the 12V DC required to power the entire stack.

| Tail485 Terminal | Century Pump Pin | Description |
| --- | --- | --- |
| 12V/24V | Pin 1 (Red) | Power Supply (In) |
| GND | Pin 2 (Black) | Common Ground |
| A | Pin 4 (Yellow) | RS485 Data + |
| B | Pin 3 (White) | RS485 Data − |

### B. Pressure Sensor to Atom S3 (Analog)

Since the Tail485 plugs into the back, the bottom 6-pin header of the Atom S3 is used for the sensor.

- **VCC:** Connect Sensor Red → Atom S3 5V pin
- **GND:** Connect Sensor Black → Atom S3 GND pin
- **Signal:** Sensor Yellow → 10 kΩ resistor → Atom S3 GPIO 7
- **Pull-Down:** 20 kΩ resistor from Atom S3 GPIO 7 → GND

> **Note:** The 10 kΩ / 20 kΩ voltage divider scales the sensor's 0.5–4.5V output down to a 3.3V-safe range for the Atom S3 GPIO. The `multiply: 1.5` filter in the ESPHome config corrects for this division.

### C. Breadboard – OLED Display & Temperature Sensor

A half-size breadboard seated inside the enclosure mounts the SSD1306 OLED and DS18B20 probe breakout. Both components share the Atom S3's bottom 6-pin header.

**SSD1306 OLED (I2C):**

| OLED Pin | Atom S3 Pin | Description |
| --- | --- | --- |
| VCC | 3.3V | Power |
| GND | GND | Ground |
| SDA | GPIO 5 | I2C Data |
| SCL | GPIO 6 | I2C Clock |

**DS18B20 Temperature Probe (1-Wire):**

| DS18B20 Pin | Connection | Description |
| --- | --- | --- |
| Red (VCC) | 3.3V | Power |
| Black (GND) | GND | Ground |
| Yellow (Data) | GPIO 8 | 1-Wire Data |
| — | 4.7 kΩ between Data and 3.3V | Required pull-up resistor |

---

## Software Configuration

The ESPHome configuration is located in [`esphome/pool_pump.yaml`](../esphome/pool_pump.yaml).

### UART & Modbus

The Tail485 is hardwired to specific GPIOs on the Atom S3:

```yaml
uart:
  id: mod_bus
  tx_pin: GPIO26
  rx_pin: GPIO32
  baud_rate: 9600

modbus:
  id: century_pump
```

### Pressure Sensor

```yaml
sensor:
  - platform: adc
    pin: GPIO7
    name: "Pool Filter Pressure"
    unit_of_measurement: "PSI"
    update_interval: 10s
    attenuation: 11db
    filters:
      - multiply: 1.5  # Corrects for the 10k/20k voltage divider
      - calibrate_linear:
          - 0.5 -> 0.0   # 0.5V base offset of sensor
          - 4.5 -> 30.0  # Max range of sensor
```

### Flashing

1. Install ESPHome: `pip install esphome`
2. Generate secrets: `op inject -i secrets.yaml.tpl -o secrets.yaml`
3. Connect the Atom S3 via USB-C.
4. Flash the configuration:

```bash
esphome run esphome/pool_pump.yaml
```

---

## Physical Installation

1. **DIP Switches:** Set Century Pump DIP Switch #1 to **ON** to enable RS485 control.
2. **Mounting:** Install the Atom S3 in a clear-top IP66 waterproof enclosure near the equipment pad. Mount at approximately 48"–60" height for easy viewing of the S3 screen without excessive bending.
3. **Plumbing:** Install the brass 1/4" NPT Street Tee on the filter tank outlet port. Use Teflon tape on all threads to prevent leaks.

---

## Functional Goals

| Goal | Description |
| --- | --- |
| **Monitoring** | View Pump RPM, Power Usage (Watts), Filter Pressure (PSI), and Water Temperature in Home Assistant |
| **Local Display** | SSD1306 OLED shows live PSI, temperature, and pump RPM without requiring a phone or HA dashboard |
| **Control** | Remotely trigger "Quick Clean" or adjust pump speeds based on electricity rates |
| **Safety – High PSI** | Alert if PSI exceeds 25 (filter needs backwashing) |
| **Safety – Prime Loss** | Alert if PSI drops to 0 while the pump is ON (prime loss) |
