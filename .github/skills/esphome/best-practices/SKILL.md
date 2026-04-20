---
name: best-practices
description: Use when creating, reviewing, or refactoring ESPHome YAML for this pool pump controller, including Modbus/UART wiring, DS18B20 and ADC sensors, Home Assistant entity quality, and pre-flash validation. Triggers: requests mentioning ESPHome, YAML config changes, sensor calibration, pin updates, automation safety alerts, or "best practices" for this repository.
---

# ESPHome Best Practices Skill

Apply this skill to produce safe, maintainable, and hardware-correct ESPHome changes for this repository.

## When To Use This Skill

- Editing `esphome/pool_pump.yaml`
- Adding or changing sensors, binary sensors, display output, or filters
- Modifying UART/Modbus behavior for the Century VGreen pump
- Reviewing YAML for ESPHome quality, consistency, and safety
- Preparing changes for flashing and Home Assistant integration checks

## Repository-Specific Constraints

- Keep `substitutions` as the single source for `device_name` and `friendly_name`.
- Do not change Tail485 UART pins: TX `GPIO26`, RX `GPIO32`.
- Keep Modbus controller address at `0x01` unless hardware evidence requires change.
- Keep credentials in secrets (`!secret`) and never hard-code values.
- Keep `captive_portal:` enabled for fallback provisioning.
- Preserve DS18B20 Fahrenheit conversion using `multiply: 1.8` then `offset: 32.0` unless unit requirements change.
- Preserve pressure divider compensation (`multiply: 1.5`) before `calibrate_linear` unless wiring changes.

## Workflow

1. Confirm intent and blast radius.
- Identify affected sections (`sensor`, `binary_sensor`, `display`, `uart`, `modbus_controller`).
- Identify whether behavior, naming, or hardware mapping changes.

2. Check hard constraints before editing.
- Validate pin usage against hardware mapping.
- Validate that entity IDs referenced by lambdas already exist or are added in the same change.
- Validate that Home Assistant-facing entities have clear names and sensible metadata.

3. Implement minimal, reversible YAML changes.
- Prefer small, focused edits instead of broad rewrites.
- Keep section headers and comment style consistent.
- Add `id:` only when cross-references are needed.

4. Apply decision rules.
- If adding another 1-Wire probe: set explicit addresses once discovered.
- If updating pressure logic: keep voltage restoration filter before linear calibration.
- If chaining filters: preserve intentional order, because ESPHome applies filters in declaration order.
- If editing alerts: avoid startup/shutdown false positives with thresholds and delays.
- If changing display lines: ensure formatting tolerates unavailable sensor states.
- If adding more Modbus sensors: group consecutive register addresses where possible to reduce bus transactions.

5. Validate before flash.
- Run `esphome config esphome/pool_pump.yaml`.
- Resolve schema, ID, and pin conflicts.
- Re-check that secrets remain externalized.

6. Validate behavior after deploy/log review.
- Confirm expected Modbus reads (RPM/power non-stale values).
- Confirm pressure and temperature ranges are plausible.
- Confirm alert sensors trigger only under expected conditions.

## Quality Criteria

- No hard-coded credentials or keys.
- No conflicts with repository hardware pin assignments.
- No dangling lambda `id(...)` references.
- Sensor units, `device_class`, and `state_class` match entity meaning.
- Calibration order is physically correct (voltage restoration before mapping).
- Changes pass `esphome config` validation.
- API encryption remains enabled with a secret-backed key.

## Completion Checklist

- [ ] YAML is valid in `esphome config`.
- [ ] Hardware constraints respected (UART pins and Modbus address).
- [ ] Secrets remain in secrets file references.
- [ ] New/changed entities are named consistently and referenced safely.
- [ ] Display and alert logic reviewed for edge conditions.

## Context7-Backed References

- ESPHome substitutions: https://github.com/esphome/esphome-docs/blob/current/content/components/substitutions.md
- ESPHome sensor filters and ordering: https://github.com/esphome/esphome-docs/blob/current/content/components/sensor/_index.md
- ESPHome modbus_controller: https://github.com/esphome/esphome-docs/blob/current/content/components/modbus_controller.md
- ESPHome CLI config validation: https://github.com/esphome/esphome-docs/blob/current/content/guides/cli.md
- ESPHome security best practices (API encryption): https://github.com/esphome/esphome-docs/blob/current/content/guides/security_best_practices.md

## Quick Prompt Starters

- "Apply esphome-best-practices and add a second DS18B20 sensor with safe addressing."
- "Review my pool_pump.yaml changes for hardware pin mistakes and calibration regressions."
- "Refactor pressure alert logic using this repository's ESPHome best practices."
