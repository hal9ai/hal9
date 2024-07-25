import re

def extract(markdown, language, default = None):
    pattern = re.compile(rf'```{language}\s+(.*?)```', re.DOTALL)
    code_blocks = pattern.findall(markdown)
    code = '\n'.join(code_blocks)
    if len(code) == 0:
        return default
    return code
