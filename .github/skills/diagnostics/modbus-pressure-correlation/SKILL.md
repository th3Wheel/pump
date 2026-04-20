---
name: modbus-pressure-correlation
description: Optional generic diagnostic workflow. Use only when explicitly requested to distinguish process faults from Modbus or serial communication dropouts by correlating at least one independent process signal with one or more communication-derived signals. Customization must come from explicit requirements such as signal sources, timing behavior, stale-data tolerance, and safety priorities.
---

# Modbus Pressure Correlation Skill

Use this optional skill to separate true process-side issues from telemetry or communication issues.

## Requirements Intake (Required)

Before changes, extract or ask for these requirements:

- Protocol profile: Modbus RTU or equivalent serial polling model, addressing scheme, refresh cadence
- Independent process signal: the non-communication-backed signal used to verify physical behavior
- Communication-derived signals: one or more metrics that depend on the serial bus
- Event profile: expected startup, shutdown, ramp, and steady-state timing
- Failure profile: what counts as stale, unknown, flatlined, or implausible data
- Safety priorities: whether to favor conservative alert suppression or fast fault exposure

If requirements are missing, stop and request only the missing fields.

## When To Use This Skill

- Explicit request to diagnose prime-loss versus communication dropouts
- Communication-derived telemetry is intermittently stale, unknown, or implausible
- Process alerts occur while serial-backed sensors show inconsistent updates
- Post-change validation of communication and process-signal interaction

## Customization Model

Use this skill with a project profile derived from requirements.

Example project profile template:

- Protocol and bus type:
- Independent process signal:
- Communication-derived signal A:
- Communication-derived signal B:
- Stale-data rule:
- Operational gate or active-state signal:
- Alert or decision logic dependent on these signals:

## Correlation Workflow

1. Confirm symptom profile.
- Process-fault symptom: the independent process signal indicates a real physical fault while communication-derived data remains fresh.
- Communication symptom: serial-derived signals become stale, unavailable, or implausibly flat without matching physical behavior.

2. Build the evidence window.
- Capture a short window before, during, and after the event.
- Compare trend continuity of the independent process signal versus communication-derived telemetry.

3. Apply branch logic.
- If the independent process signal indicates failure while communication-derived data remains fresh and plausible: classify as likely process fault.
- If communication-derived signals freeze, go stale, or drop out while the independent process signal remains plausible: classify as likely communication issue.
- If both degrade together: classify as ambiguous and require wiring, power, timing, and instrumentation checks.

4. Validate anti-false-positive behavior.
- Ensure startup and shutdown transitions are excluded with gating signals and delayed assertions when required.
- Confirm fault thresholds are not too aggressive for normal transition behavior.

5. Propose corrective path.
- Process-fault path: adjust process-side checks, thresholds, gating, or timing assumptions.
- Communication path: inspect serial wiring, bus timing, update intervals, addressing, and controller stability.

## Branch Outcome YAML Examples

Likely process fault (communication side is coherent, tighten fault detection):

```yaml
binary_sensor:
  - platform: template
    name: "Process Fault Alert"
    id: process_fault_alert
    device_class: problem
    filters:
      - delayed_on: <assert_delay>
    lambda: |-
      return id(active_state_signal).state >= active_threshold && id(process_signal).state < process_fault_threshold;
```

Communication dropout likely (prevent false process-fault alerts from stale telemetry):

```yaml
binary_sensor:
  - platform: template
    name: "Process Fault Alert"
    id: process_fault_alert
    device_class: problem
    filters:
      - delayed_on: <assert_delay>
    lambda: |-
      // Require a second fresh communication-derived signal before asserting the fault.
      return id(active_state_signal).state >= active_threshold
        && id(comm_signal_a).state > comm_signal_a_min
        && id(process_signal).state < process_fault_threshold;
```

Ambiguous case (conservative anti-chatter until root cause is isolated):

```yaml
binary_sensor:
  - platform: template
    name: "Process Fault Alert"
    id: process_fault_alert
    device_class: problem
    filters:
      - delayed_on: <longer_assert_delay>
    lambda: |-
      // Conservative temporary profile while debugging.
      return id(active_state_signal).state >= conservative_active_threshold
        && id(process_signal).state < conservative_fault_threshold;
```

## Decision Matrix

- Likely process fault:
  - Independent process signal crosses the fault threshold and stays there
  - Communication-derived signals remain fresh enough to trust
  - Alert behavior aligns with observed physical state
- Likely comm dropout:
  - Communication-derived signals become stale, unknown, or flatline
  - Independent process signal remains plausible for operating conditions
  - Alert behavior does not align with physical state
- Ambiguous:
  - Independent and communication-backed signals both unstable in same interval
  - Requires hardware and timing checks before retuning alerts

## Quality Criteria

- Correlation uses at least one independent process signal plus one communication-derived signal.
- All thresholds, delays, and stale-data rules are traceable to explicit requirements.
- Classification records observed timing sequence, not a single-point snapshot.
- Startup/shutdown windows are excluded from final diagnosis.
- Proposed fixes are tied to classified failure mode.

## Completion Checklist

- [ ] Requirements profile captured and applied.
- [ ] Event window captured and compared across process and communication-derived signals.
- [ ] Classification chosen: process fault, comm dropout, or ambiguous.
- [ ] Suggested mitigation aligns with classification.
- [ ] No credential/security regressions introduced in YAML changes.

## Shared Reference

- Incident template: `../../references/incident-review-template.md`

## Quick Prompt Starters

- "Use modbus-pressure-correlation and derive all logic from these requirements: <paste requirements>."
- "Run the optional modbus-pressure-correlation workflow on this event using my process and comm signal profile."
