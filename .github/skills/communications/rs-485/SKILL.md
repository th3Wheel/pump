---
name: rs-485
description: Generic RS-485 communication workflow. Use when configuring, troubleshooting, or reviewing UART/RS-485 links and Modbus-style polling. Customization must come from explicit requirements (hardware, protocol, timing, and reliability goals), not hardcoded device assumptions.
---

# RS-485 Skill

This skill provides a reusable, requirements-driven process for RS-485 communication reliability.

## Requirements Intake (Required)

Before changes, extract or ask for these requirements:

- Hardware profile: controller, transceiver, wiring map, and any fixed pins
- Protocol profile: Modbus RTU or custom framing, addressing scheme, register map
- Serial profile: baud rate, parity, stop bits, response timing constraints
- Polling profile: update intervals, retry policy, bus load limits
- Reliability goals: acceptable stale-data window, false-alert tolerance, recovery behavior
- Safety constraints: what must never be changed without explicit approval

If requirements are missing, stop and request only the missing fields.

## Use This Skill When

- Configuring or reviewing RS-485/UART communication settings
- Diagnosing stale, missing, or implausible telemetry over serial links
- Tuning poll rates and bus stability
- Distinguishing communication failures from true process faults

## Customization Model

Use this skill with a project profile derived from requirements.

Example project profile template:

- TX pin:
- RX pin:
- Device address(es):
- Baud/parity/stop:
- Poll interval targets:
- Key telemetry signals:
- Safety-critical alerts dependent on comm data:

## Workflow

1. Confirm symptom and scope.
- Identify if issue is configuration, wiring assumptions, timing, or data interpretation.
- Identify dependent telemetry and alerts that rely on RS-485 data.

2. Validate requirements-derived constraints.
- Enforce fixed pins, addressing rules, and protocol limits from requirements.
- Keep approved serial profile unless controlled testing changes it.
- Reject changes that violate safety constraints.

3. Review Modbus configuration quality.
- Confirm one consistent communication path from UART to protocol layer to telemetry entities.
- Ensure update intervals are reasonable for bus load.
- If adding multiple registers, prefer contiguous reads where possible.

4. Apply branch diagnosis.
- If comm-derived metrics are stale while independent signals remain plausible: suspect communication dropout.
- If independent process signal fails while comm data is fresh: suspect process-side fault.
- If all signals are unstable: classify as ambiguous and check power, wiring, and timing assumptions.

5. Stabilize with minimal edits.
- Make the smallest reversible change.
- Avoid simultaneous threshold and comm changes unless needed for safety.
- Re-test and compare before and after behavior.

6. Validate and verify.
- Run project-specific config/build validation command from requirements.
- Confirm no broken references in automation or alert logic.
- Verify telemetry freshness and plausibility after deployment.

## Quality Criteria

- All communication settings are traceable to explicit requirements.
- Comm diagnosis uses at least two signals, not one snapshot.
- Configuration changes are minimal and traceable.
- Project validation checks pass.

## Completion Checklist

- [ ] Requirements profile captured and applied.
- [ ] Comm symptoms classified: dropout, process fault, or ambiguous.
- [ ] Minimal corrective change applied.
- [ ] Validation passed and runtime behavior improved.

## Quick Prompt Starters

- "Use the rs-485 skill and derive all settings from these requirements: <paste requirements>."
- "Review my RS-485 setup with rs-485 skill using this hardware/protocol profile."
- "Classify this event as comm dropout or process fault using requirements-driven correlation."
