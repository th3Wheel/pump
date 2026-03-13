# DS18B20 Examples

These examples are intentionally limited to patterns that fit this pool pump repository.

## Single-Probe ESPHome Fragment

This matches the current project structure: one 1-Wire bus on `GPIO8` and one `dallas_temp` sensor exposed in Fahrenheit.

```yaml
one_wire:
  - platform: gpio
    pin: GPIO8

sensor:
  - platform: dallas_temp
    name: "Pool Equipment Temperature"
    id: equipment_temp
    unit_of_measurement: "°F"
    device_class: temperature
    state_class: measurement
    update_interval: 30s
    filters:
      - multiply: 1.8
      - offset: 32.0
```

## Multiple Probes On The Same Bus

Use explicit addresses only after discovering them from ESPHome logs.

```yaml
one_wire:
  - platform: gpio
    pin: GPIO8

sensor:
  - platform: dallas_temp
    name: "Pool Equipment Temperature"
    id: equipment_temp
    address: 0x1111111111111128
    unit_of_measurement: "°F"
    device_class: temperature
    state_class: measurement
    update_interval: 30s
    filters:
      - multiply: 1.8
      - offset: 32.0

  - platform: dallas_temp
    name: "Pump Return Temperature"
    id: pump_return_temp
    address: 0x2222222222222228
    unit_of_measurement: "°F"
    device_class: temperature
    state_class: measurement
    update_interval: 30s
    filters:
      - multiply: 1.8
      - offset: 32.0
```

## Calibration Placeholder

If a probe consistently reads high or low, add a small offset after the Fahrenheit conversion.

```yaml
sensor:
  - platform: dallas_temp
    name: "Pool Equipment Temperature"
    id: equipment_temp
    unit_of_measurement: "°F"
    filters:
      - multiply: 1.8
      - offset: 32.0
      - offset: -0.4
```

## Display Usage

This matches the existing OLED display pattern in the repo.

```yaml
display:
  - platform: ssd1306_i2c
    model: "SSD1306 128x64"
    address: 0x3C
    lambda: |-
      it.printf(0, 40, id(font_small), "Temp: %.1f F", id(equipment_temp).state);
```

## Home Assistant Card

```yaml
type: entities
title: Pool Pump Sensors
entities:
  - sensor.pool_equipment_temperature
  - sensor.pool_filter_pressure
  - sensor.pump_power
  - sensor.pump_rpm
```
