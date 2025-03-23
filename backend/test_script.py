import io
import contextlib
import re

def test_script(code: str):
    # Extract the code inside """python and """
    if not code: 
        return {
            "success": False,
            "output": stdout.getvalue(),
            "error": str(e)
        }
    match = re.match(r"```python\n(.*?)\n```", code, re.DOTALL)
    if match:
        code = match.group(1)  # Extract the actual code inside the docstring

    stdout = io.StringIO()
    stderr = io.StringIO()

    try:
        with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            exec(code, {})  # empty global scope for isolation
        return {
            "success": True,
            "output": stdout.getvalue(),
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "output": stdout.getvalue(),
            "error": str(e)
        }