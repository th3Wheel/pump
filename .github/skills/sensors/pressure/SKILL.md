---
name: pressure
description: Generic pressure-sensor workflow. Use when creating, calibrating, or reviewing analog or digitized pressure measurement, conversion filters, smoothing, and alert thresholds. Customization must come from explicit requirements such as sensor range, wiring model, calibration references, response time, and false-alert tolerance.
---

# Pressure Sensor Skill

This skill provides a reusable, requirements-driven process for pressure-sensor configuration, calibration, and tuning.

## Requirements Intake (Required)

Before changes, extract or ask for these requirements:

- Sensor profile: sensor type, output range, engineering units, operating span
- Electrical profile: ADC or bus interface, divider/gain stages, supply voltage, expected input limits
- Calibration profile: known reference points, datasheet mapping, gauge or reference instrument
- Responsiveness profile: update interval, acceptable lag, smoothing tolerance
- Alert profile: trigger thresholds, delays, gating signals, acceptable false-positive rate
- Safety constraints: settings that must not change without approval

If requirements are missing, stop and request only the missing fields.

## Use This Skill When

- Configuring or reviewing pressure measurement logic
- Calibrating raw sensor output to engineering units
- Adjusting pressure-related alert behavior
- Troubleshooting unstable, noisy, or implausible readings
- Reviewing pressure-related configuration changes before deployment

## Customization Model

Use this skill with a project profile derived from requirements.

Example project profile template:

- Pressure source ID or entity:
- Input interface and pin/bus:
- Sensor output span:
- Engineering units:
- Conversion chain:
- Calibration references:
- Alert thresholds and delays:

## Workflow

1. Confirm change type and blast radius.
- Decide whether this is interface mapping, calibration, smoothing, alert logic, or display/reporting output.
- Identify all dependent sensors, alerts, and presentations.

2. Validate requirements-derived electrical assumptions.
- Enforce interface, pin/bus, and signal-conditioning rules from requirements.
- Confirm expected sensor output remains inside allowed input limits.
- Reject conversion changes that conflict with documented wiring or conditioning stages.

3. Implement pressure sensor edits in safe order.
- Keep physical conversion before calibration, and calibration before smoothing.
- Use calibration points that match known pressure references.
- Apply stricter smoothing by default after calibration:
- Start with `median` (`window_size: 5`, `send_every: 5`, `send_first_at: 1`).
- If jitter persists, move to `sliding_window_moving_average` (`window_size: 10`, `send_every: 5`).
- Keep units, metadata, and classifications aligned with the engineering measurement.

4. Apply decision rules.
- If pressure reads too low across the range: verify scaling or signal-conditioning assumptions first.
- If pressure offset is wrong near idle: recalibrate low-end reference point.
- If curve is wrong at high pressure: add or refine high-end calibration point(s).
- If readings are noisy: add smoothing filters after core conversion and calibration.
- If alerts chatter on transitions: add delay or tune thresholds and gating signals to prevent false positives.

5. Validate configuration.
- Run the project-specific validation command from requirements.
- Ensure no broken references in alerts, automation, or display logic.
- Recheck no restricted or safety-sensitive settings were changed without approval.

6. Verify runtime behavior.
- Confirm pressure is plausible at known operating points.
- Confirm alerts behave as intended above and below threshold.
- Confirm gating signals suppress transition-state false positives.

## Quality Criteria

- All conversion and threshold values are traceable to explicit requirements.
- Preserves physically correct conversion order in filters.
- Uses calibration points tied to known pressure references.
- Uses explicit smoothing strategy unless raw responsiveness is intentionally required.
- Keeps alert logic resilient to transitional states.
- Project validation checks pass.

## Recommended Tuning Table

- Threshold or alert trigger | derive from requirements | tune from observed operating data | Base on normal range plus safety margin. |
- Fault threshold | derive from requirements | tune from known abnormal behavior | Keep low enough to detect real faults but not transients. |
- Gating signal threshold | derive from requirements | tune from process state data | Use when another signal indicates active operation. |
- Assertion delay | derive from requirements | tune from transition behavior | Increase when startup or ramp behavior is noisy. |
- Update interval | derive from requirements | balance freshness and noise | Faster updates may require stronger smoothing. |
- Smoothing strategy | median by default | escalate only as needed | Apply smoothing after conversion and calibration filters. |

## Completion Checklist

- [ ] Requirements profile captured and applied.
- [ ] Filter order is correct for conversion, calibration, then smoothing.
- [ ] Pressure output is stable and plausible across expected states.
- [ ] Alert thresholds, gating, and delays avoid false positives.
- [ ] Project validation command passes.

## References

- ESPHome ADC sensor docs: https://github.com/esphome/esphome-docs/blob/current/content/components/sensor/adc.md
- ESPHome filter ordering: https://github.com/esphome/esphome-docs/blob/current/content/components/sensor/_index.md
- ESPHome calibrate_linear: https://github.com/esphome/esphome-docs/blob/current/content/components/sensor/filter/calibrate_linear.md
- ESPHome CLI config validation: https://github.com/esphome/esphome-docs/blob/current/content/guides/cli.md
- See `references/calibration-worksheet.md` for field calibration and tuning records

## Quick Prompt Starters

- "Use the pressure skill and derive all tuning from these requirements: <paste requirements>."
- "Review my pressure sensor conversion and alert logic using this requirements profile."
- "Use the pressure skill to troubleshoot low readings from this interface and calibration setup."
