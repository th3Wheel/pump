---
name: safety-alert-tuning
description: Optional generic safety workflow. Use only when explicitly requested to tune binary sensor or alert thresholds, delays, gating logic, and anti-chatter behavior. Customization must come from explicit requirements such as acceptable false-positive rate, detection speed, process state signals, and safety priorities.
---

# Safety Alert Tuning Skill

Use this optional skill to tune alert behavior for reliability and low false-positive rates.

## Requirements Intake (Required)

Before changes, extract or ask for these requirements:

- Alert purpose: what condition is being detected and why it matters
- Detection priority: favor fewer false positives, fewer false negatives, or balanced behavior
- Available inputs: trigger signal, clear signal, gating signals, confidence signals
- Timing profile: normal startup, shutdown, ramp, and steady-state durations
- Tuning limits: allowed threshold range, delay range, hysteresis rules
- Safety constraints: minimum detection sensitivity or maximum allowed alert delay

If requirements are missing, stop and request only the missing fields.

## When To Use This Skill

- Explicit request to tune alert sensitivity
- Frequent false alerts during startup or shutdown
- Alerts trigger late or fail to trigger in real fault cases
- Changes to sensor calibration or process operating profile

## Customization Model

Use this skill with a project profile derived from requirements.

Example project profile template:

- Alert IDs or names:
- Source signals:
- Gating signals:
- Current thresholds:
- Current delays:
- Acceptable false-positive rate:
- Maximum acceptable detection delay:

## Tuning Workflow

1. Define tuning objective.
- Minimize false positives, false negatives, or both.
- Identify whether issue is threshold, delay, or gating logic.

2. Set baseline behavior.
- Record current thresholds and delays.
- Observe behavior across inactive, startup, steady-state, and shutdown phases.

3. Tune in controlled increments.
- Thresholds: adjust in small PSI/RPM steps.
- Delays: adjust in small time increments (for example 5 to 10 seconds).
- Gating: require process-state confirmation before fault assertions.

4. Apply anti-chatter patterns.
- Use `delayed_on` to suppress transient spikes/dips.
- Keep hysteresis-like behavior through separate trigger and clear logic where needed.
- Avoid over-filtering that masks real faults.

5. Re-validate across operating phases.
- Confirm no prime-loss alert during expected pressure build-up.
- Confirm high-pressure alert still catches sustained over-threshold conditions.
- Confirm alert clear behavior is predictable.

## Recommended Optional Baselines

- Thresholds: derive from normal operating range plus safety margin
- Gating thresholds: derive from process-state indicators that confirm active operation
- Assertion delays: derive from observed transition durations plus tolerance margin
- Clear conditions: define separately when hysteresis is needed

## Tradeoff Matrix

| Tuning Direction | False Positives | False Negatives | Typical Use |
| --- | --- | --- | --- |
| Lower trigger threshold | Lower | Higher | Noisy systems with many transient dips |
| Higher trigger threshold | Higher | Lower | Safety-first detection of subtle faults |
| Higher gating threshold | Lower | Higher | Avoid alerts during ramp or idle phases |
| Lower gating threshold | Higher | Lower | Catch low-activity fault scenarios sooner |
| Longer delayed_on | Lower | Higher | Chatter-heavy transitions |
| Shorter delayed_on | Higher | Lower | Fast fault detection priority |

## Anti-Chatter Pattern Snippets

```yaml
filters:
  - delayed_on: 30s
```

```yaml
lambda: |-
  return id(gating_signal).state >= gate_threshold && id(trigger_signal).state < trigger_threshold;
```

## Quality Criteria

- Threshold changes are justified by observed operating data.
- Delay tuning eliminates transition chatter without hiding persistent faults.
- Gating logic remains aligned to process-state requirements.
- Alert behavior is verified in at least transition and steady-state scenarios.

## Completion Checklist

- [ ] Requirements profile captured and applied.
- [ ] Threshold and delay values documented before and after tuning.
- [ ] False positives reduced in transition windows.
- [ ] Fault detection maintained for sustained abnormal conditions.
- [ ] Project validation command passes if edits were made.

## Shared Reference

- Incident template: `../../references/incident-review-template.md`

## Quick Prompt Starters

- "Use safety-alert-tuning and derive all decisions from these alert requirements: <paste requirements>."
- "Apply optional safety-alert-tuning to reduce false positives using this timing and safety profile."
