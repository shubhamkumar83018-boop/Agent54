def evaluate_rule(operator: str, threshold: float, actual: float) -> bool:
    if operator == ">=":
        return actual >= threshold
    elif operator == "<=":
        return actual <= threshold
    elif operator == ">":
        return actual > threshold
    elif operator == "<":
        return actual < threshold
    elif operator == "=" or operator == "==":
        return actual == threshold
    
    raise ValueError(f"Unknown operator: {operator}")

def calculate_gap(operator: str, threshold: float, actual: float) -> float:
    # If it's compliant, gap is 0
    if evaluate_rule(operator, threshold, actual):
        return 0.0
        
    return abs(actual - threshold)

def determine_compliance_status(operator: str, threshold: float, actual: float) -> str:
    if evaluate_rule(operator, threshold, actual):
        return "COMPLIANT"
    
    # Simple logic for AT_RISK vs NON_COMPLIANT could be based on percentage gap.
    # For now, if it fails the rule, it's NON_COMPLIANT. 
    # At Risk could be if it's very close (within 10%).
    gap = calculate_gap(operator, threshold, actual)
    if threshold != 0:
        gap_percentage = (gap / abs(threshold)) * 100
        if gap_percentage <= 5.0:
            return "AT_RISK"
            
    return "NON_COMPLIANT"
