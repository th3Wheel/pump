# Pressure Calibration Worksheet

Use this worksheet during field calibration, threshold tuning, and post-change verification.

## Session Metadata

- Date:
- Firmware/config commit:
- Technician:
- Sensor model/range:
- Notes:

## Hardware Snapshot

- ADC pin: GPIO7
- Divider wiring verified (10 kOhm series, 20 kOhm pull-down): yes/no
- Supply voltage stable: yes/no
- Gauge reference instrument:

## Calibration Data Points

Record at least 2 points (low/high). Prefer 3 to 5 points for confidence.

- P1
  - Gauge PSI (true):
  - Raw or observed value before calibrate_linear:
  - Mapped PSI after filters:
  - Error (mapped - true):
- P2
  - Gauge PSI (true):
  - Raw or observed value before calibrate_linear:
  - Mapped PSI after filters:
  - Error (mapped - true):
- P3
  - Gauge PSI (true):
  - Raw or observed value before calibrate_linear:
  - Mapped PSI after filters:
  - Error (mapped - true):
- P4
  - Gauge PSI (true):
  - Raw or observed value before calibrate_linear:
  - Mapped PSI after filters:
  - Error (mapped - true):
- P5
  - Gauge PSI (true):
  - Raw or observed value before calibrate_linear:
  - Mapped PSI after filters:
  - Error (mapped - true):

## Proposed Filter Chain

Keep physical conversion first, then calibration, then smoothing.

```yaml
filters:
  - multiply: 1.5
  - calibrate_linear:
      - <observed_low> -> <true_low>
      - <observed_high> -> <true_high>
  - median:
      window_size: 5
      send_every: 5
      send_first_at: 1
```

Optional stronger smoothing if needed:

```yaml
  - sliding_window_moving_average:
      window_size: 10
      send_every: 5
```

## Alert Tuning Worksheet

- High pressure threshold (PSI)
  - Current: 25.0
  - Candidate:
  - Final:
  - Reason:
- Prime-loss PSI threshold
  - Current: 1.0
  - Candidate:
  - Final:
  - Reason:
- Prime-loss RPM gate
  - Current: 500
  - Candidate:
  - Final:
  - Reason:
- Prime-loss delayed_on
  - Current: 30s
  - Candidate:
  - Final:
  - Reason:

## Verification Checklist

- [ ] `esphome config esphome/pool_pump.yaml` passes
- [ ] Pump OFF baseline PSI plausible
- [ ] Normal run PSI stable without chatter
- [ ] High pressure alert triggers only above intended threshold
- [ ] Prime-loss alert does not trigger during startup transients
- [ ] Display and Home Assistant entities show expected values
