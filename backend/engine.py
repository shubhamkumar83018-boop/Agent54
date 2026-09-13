from typing import Any, Optional

def parse_numeric(val: Any) -> Optional[float]:
    """Safely parse numbers, ratios (e.g. '1:20' -> 20.0), and percentage strings."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        val_str = val.strip()
        if ":" in val_str:
            parts = val_str.split(":")
            try:
                denom = float(parts[0])
                num = float(parts[1])
                return num / denom if denom != 0 else num
            except Exception:
                pass
        try:
            # Strip % or common units
            clean = val_str.replace('%', '').strip()
            return float(clean)
        except ValueError:
            return None
    return None

def evaluate_rule(operator: str, threshold: Any, actual: Any) -> bool:
    num_actual = parse_numeric(actual)
    num_threshold = parse_numeric(threshold)

    # If both can be compared numerically
    if num_actual is not None and num_threshold is not None:
        if operator == ">=":
            return num_actual >= num_threshold
        elif operator == "<=":
            return num_actual <= num_threshold
        elif operator == ">":
            return num_actual > num_threshold
        elif operator == "<":
            return num_actual < num_threshold
        elif operator in ("=", "=="):
            return num_actual == num_threshold
        elif operator == "!=":
            return num_actual != num_threshold

    # Fallback to string comparison
    str_actual = str(actual).strip().lower() if actual is not None else ""
    str_threshold = str(threshold).strip().lower() if threshold is not None else ""

    if operator in ("=", "=="):
        return str_actual == str_threshold
    elif operator == "!=":
        return str_actual != str_threshold

    # Default to False if comparison isn't possible
    return False

def calculate_gap(operator: str, threshold: Any, actual: Any) -> float:
    # If it's compliant, gap is 0
    if evaluate_rule(operator, threshold, actual):
        return 0.0

    num_actual = parse_numeric(actual)
    num_threshold = parse_numeric(threshold)
    if num_actual is not None and num_threshold is not None:
        return round(abs(num_actual - num_threshold), 2)

    return 1.0

def determine_compliance_status(operator: str, threshold: Any, actual: Any) -> str:
    if evaluate_rule(operator, threshold, actual):
        return "COMPLIANT"

    num_actual = parse_numeric(actual)
    num_threshold = parse_numeric(threshold)
    if num_actual is not None and num_threshold is not None and num_threshold != 0:
        gap = abs(num_actual - num_threshold)
        gap_percentage = (gap / abs(num_threshold)) * 100
        if gap_percentage <= 10.0:
            return "AT_RISK"

    return "NON_COMPLIANT"
