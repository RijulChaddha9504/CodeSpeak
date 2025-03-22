import io
import contextlib

def test_script(code: str):
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
    
