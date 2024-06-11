import re

def get_Code(text, language):
    pattern = re.compile(rf'```{language}\s+(.*?)```', re.DOTALL)
    code_blocks = pattern.findall(text)
    code = '\n'.join(code_blocks)
    return code
