
# DS18B20 Calibration Workflow

1. Baseline

Place all probes together.

Allow 10–15 minutes to stabilize.

Record readings from each probe.

2. Ice Bath (~0°C)

Prepare crushed ice plus water.

Submerge probes without touching container walls.

Record readings.

Compute offsets: offset = 0.0 - measured.

3. Boiling Water (~100°C)

Submerge probes away from pot walls and steam.

Record readings.

Check linearity across range.

4. Apply Corrections

Simple Offset

Use ESPHome offset filter:


```
filters:

- offset: 0.18
```

Two-Point Linear Correction

Apply a linear transform (y = m * x + b) using a lambda filter or custom component.

5. Verification

Place probes together again.

Confirm alignment within ±0.1–0.2°C.
