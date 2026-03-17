# Incident Review Template

Use this single template for both:

- diagnostics/modbus-pressure-correlation
- alerts/safety-alert-tuning

## Prompt Starters

- "Use the shared incident review template for this pump alert event."
- "Run incident review template before tuning thresholds and delays."
- "Apply incident review template and classify as prime-loss, comm dropout, or ambiguous."

## Incident Metadata

- Date and time:
- Environment (pad conditions, weather, maintenance state):
- Firmware/config revision:
- Reporter:
- Summary:

## Event Window

- Start timestamp:
- End timestamp:
- Pump state transitions observed:

## Signal Snapshot

- filter_pressure trend:
- pump_rpm trend:
- pump_power trend:
- Alert entity transitions:

## Classification

Choose one:

- Likely prime-loss
- Likely communication dropout
- Ambiguous

Evidence:

- Pressure behavior:
- RPM behavior:
- Power behavior:
- Startup/shutdown exclusion applied: yes/no

## Current Alert Settings

- High pressure threshold:
- Prime-loss pressure threshold:
- Prime-loss RPM gate:
- Prime-loss delayed_on:
- Additional filters:

## Proposed Change Set

- Threshold changes:
- Delay changes:
- Gating logic changes:
- Smoothing/filter changes:
- Why this should reduce false alerts without masking real faults:

## Validation Results

- esphome config pass/fail:
- Startup behavior:
- Steady-state behavior:
- Fault simulation or observed real fault behavior:
- Remaining risks:

## Final Decision

- Accepted values:
- Rollback trigger conditions:
- Follow-up owner and date:
