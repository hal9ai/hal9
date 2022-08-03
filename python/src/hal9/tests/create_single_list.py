import json

def encode(data):
  if (type(data).__name__ == "DataFrame"):
    return data.to_json(orient = 'records')
  else:
    return json.dumps(data)

def add_id_to_list(iterable):
    
    id = 0
    for element in iterable:
        element["id"] = id
        id = id+1
    return(iterable)

json_metadata = open('D:/hal9ai5/python/src/hal9/data/load.js')
component = json.load(json_metadata)

steps = []
params = {}

new_id = 0

new_step = {k: component.get(k, None) for k in ('name', 'label', 'language', 'description', 'icon')}
new_step["params"] = {}
new_step["id"] = new_id

steps.append(new_step)

step_param_list = component["params"]
param_names = [param["name"] for param in step_param_list]

param_dict = dict(zip(param_names, step_param_list))

inputs = {
    "dataset": pandas.DataFrame({"cyl": [1,2], "mpg": [2,3]})
}

for parameter_name, parameter_value in  inputs.items():
    standard_value = param_dict[parameter_name]["value"]

    if ~("static" in param_dict[parameter_name].keys()):
        param_dict[parameter_name]["static"] = True

    if isinstance(standard_value, list):
        
        standard_value = add_id_to_list(standard_value)

        id_value = 0
        for element in standard_value:
          element["id"] = id_value
          id_value = id_value + 1

          if element["control"] == "dataframe":
            element["value"] = encode(parameter_value)
          else:
            element["value"] = parameter_value
    else:

        if param_dict[parameter_name]["static"]:
            element["value"] = parameter_value
        else:
            element["value"] = [{"name": parameter_value}]

params[new_id] = param_dict