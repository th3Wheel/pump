---
name: ds18b20
description: Use when working on the pool pump DS18B20 temperature probe, ESPHome 1-Wire configuration, dallas_temp sensors, GPIO8 wiring, or temperature calibration examples for this repository.
---

# DS18B20 Skill

This skill provides repo-specific guidance for the DS18B20 temperature probe used by the pool pump controller.

## Use This Skill When

- Updating the DS18B20 sensor configuration in `esphome/pool_pump.yaml`
- Adding a second 1-Wire probe to the same bus
- Fixing GPIO8 wiring or pull-up resistor guidance
- Adjusting temperature calibration or Fahrenheit conversion filters

## Repository Context

- Board: M5Stack Atom S3
- 1-Wire bus: GPIO8
- ESPHome pattern in this repo: `one_wire` plus `platform: dallas_temp`
- Current sensor id: `equipment_temp`
- Current output unit: Fahrenheit via `multiply: 1.8` and `offset: 32.0`

## Expectations

- Keep examples aligned with the existing ESPHome configuration in this repo
- Do not switch examples to a conflicting `dallas:` style unless the repo is being migrated deliberately
- Keep hardware notes consistent with the documented 4.7 kOhm pull-up resistor between 3.3V and the data line

## References

- See `conventions.md` for repository-specific wiring and naming rules
- See `examples.md` for valid ESPHome and Home Assistant snippets
- See `calibration/workflow.md` for probe calibration steps