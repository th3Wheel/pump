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

## Workflow

1. Confirm scope.
- Decide whether the request is wiring guidance, YAML edits, or calibration updates.
- Identify whether the change is single-probe or multi-probe on the same 1-Wire bus.

2. Validate bus and hardware assumptions.
- Keep the bus on GPIO8 with `one_wire` and `platform: gpio`.
- Keep an external pull-up resistor around 4.7 kOhm between 3.3V and data.
- Avoid changing to parasite-power assumptions unless explicitly requested and verified.

3. Apply YAML changes safely.
- Use `platform: dallas_temp` sensors on the configured 1-Wire bus.
- Keep Fahrenheit conversion filter order (`multiply` then `offset`) when output must remain in degF.
- For multiple probes, prefer explicit `address:` values discovered from logs over relying on discovery order.

4. Validate configuration and references.
- Run `esphome config esphome/pool_pump.yaml`.
- Ensure every lambda or display reference points to a valid sensor `id`.
- Confirm naming remains consistent with repository conventions.

5. Verify behavior.
- Confirm values are plausible after stabilization.
- Re-check calibration offsets/linearity if readings diverge across probes.

## Expectations

- Keep examples aligned with the existing ESPHome configuration in this repo
- Do not switch examples to a conflicting `dallas:` style unless the repo is being migrated deliberately
- Keep hardware notes consistent with the documented 4.7 kOhm pull-up resistor between 3.3V and the data line

## Quality Criteria

- Uses `one_wire` with `platform: gpio` on GPIO8 unless hardware migration is intentional.
- Uses `platform: dallas_temp` for DS18B20 examples in this repository.
- Multi-probe configs use explicit addresses when probe identity matters.
- Fahrenheit conversion remains mathematically and operationally correct.
- YAML passes `esphome config` without schema or ID errors.

## References

- See `conventions.md` for repository-specific wiring and naming rules
- See `examples.md` for valid ESPHome and Home Assistant snippets
- See `calibration/workflow.md` for probe calibration steps
- See `references/address-discovery.md` for log-based address capture and validation
- ESPHome Dallas temperature sensor docs: https://github.com/esphome/esphome-docs/blob/current/content/components/sensor/dallas_temp.md
- ESPHome 1-Wire docs: https://github.com/esphome/esphome-docs/blob/current/content/components/one_wire/_index.md
- ESPHome 1-Wire GPIO config: https://github.com/esphome/esphome-docs/blob/current/content/components/one_wire/gpio.md
- ESPHome CLI config validation: https://github.com/esphome/esphome-docs/blob/current/content/guides/cli.md

## Quick Prompt Starters

- "Use the DS18B20 skill to add a second probe and follow `references/address-discovery.md` for ROM addressing."
- "Review my DS18B20 setup and verify address mapping and Fahrenheit conversion order."