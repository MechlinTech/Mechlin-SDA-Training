import ast
import operator

_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
}


def calculate(expression: str) -> str:
    """Safely evaluate a basic arithmetic expression."""
    try:
        tree = ast.parse(expression, mode="eval")
        result = _evaluate(tree.body)
        return f"Calculation result: {result}"
    except (ValueError, TypeError, ZeroDivisionError, SyntaxError) as exc:
        return f"Calculation error: {exc}"


def _evaluate(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value

    if isinstance(node, ast.BinOp) and type(node.op) in _OPERATORS:
        left = _evaluate(node.left)
        right = _evaluate(node.right)
        return _OPERATORS[type(node.op)](left, right)

    if isinstance(node, ast.UnaryOp) and isinstance(node.op) in (ast.UAdd, ast.USub):
        value = _evaluate(node.operand)
        return value if isinstance(node.op, ast.UAdd) else -value

    raise ValueError("Only basic arithmetic expressions are supported")
