import glob
import json

def unpack_param_names(params):
    content = ""
    for param in params:
        content = content + ", " + param["name"]
    return(content)

def unpack_params(params):
    content = ""
    for param in params:
     if "description" in param.keys():
        description = param["description"]
     else:
        description = ""
   
     content = content+"      :param str "+param["name"]+": "+description+"\n" 
    return(content)

def fstr(template):
    return eval(f"f'''{template}'''")

input_file = open("src/hal9/data/__init__.py")
output_file = open("src/hal9/__init__.py", "w")

output_file.writelines(input_file.readlines())
input_file.close()

code = '''\n
  def {components["function"]}(self {unpack_param_names(components["params"])}):
    """{components["description"]}\n
{unpack_params(components["params"])}
    """
    self.add_step("{components["function"]}" {unpack_param_names(components["params"])})
    return(self)
'''

for file in glob.glob("src/hal9/data/*.js"):

    print(file)

    components = json.load(open(file))

    if "function" in components.keys():

        output_file.write(fstr(code))

output_file.close()