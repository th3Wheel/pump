# DS18B20 Address Discovery and Verification

Use this guide when adding multiple DS18B20 probes on the same 1-Wire bus.

## Goal

Capture real sensor ROM addresses from logs and bind each probe to a stable `address:` value in YAML.

## Prerequisites

- ESPHome CLI installed
- Device connected over USB or reachable over network
- `one_wire` configured on `GPIO8`

## Discover Addresses

1. Make sure the DS18B20 probes are connected and powered.
2. Start ESPHome logs:

```bash
esphome logs esphome/pool_pump.yaml
```

1. Look for Dallas/1-Wire sensor address lines and copy each `0x...` value.
1. Label each physical probe while reading logs so identities do not get swapped.

Tip: You can filter log output while keeping timestamps visible:

```bash
esphome logs esphome/pool_pump.yaml | grep -Ei "dallas|one_wire|address|rom"
```

## Apply Addresses in YAML

Add explicit addresses per probe under `platform: dallas_temp`:

```yaml
sensor:
  - platform: dallas_temp
    name: "Pool Equipment Temperature"
    id: equipment_temp
    address: 0x1111111111111128
    unit_of_measurement: "degF"
    filters:
      - multiply: 1.8
      - offset: 32.0

  - platform: dallas_temp
    name: "Return Line Temperature"
    id: return_line_temp
    address: 0x2222222222222228
    unit_of_measurement: "degF"
    filters:
      - multiply: 1.8
      - offset: 32.0
```

## Verify Configuration

1. Validate YAML schema and IDs:

```bash
esphome config esphome/pool_pump.yaml
```

1. Re-open logs and verify each entity reports expected values:

```bash
esphome logs esphome/pool_pump.yaml | grep -Ei "equipment|return|dallas|temperature"
```

1. If values look swapped, keep addresses as-is and fix naming to match physical probe placement.

## Common Mistakes

- Copying placeholder addresses from docs instead of real discovered ROM values
- Relying on probe discovery order instead of explicit addresses
- Skipping `esphome config` after editing IDs and lambdas
