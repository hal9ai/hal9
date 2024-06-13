import re

def extract(markdown, language):
    pattern = re.compile(rf'```{language}\s+(.*?)```', re.DOTALL)
    code_blocks = pattern.findall(markdown)
    code = '\n'.join(code_blocks)
    return code
