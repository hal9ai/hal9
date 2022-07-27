import yaml
import glob
import json

files = glob.glob("../scripts/*/*.js")
components = json.load(open("../scripts/components.json"))

for step_group in components:
    for step in components[step_group]:

        if step["build"] != "true":
            continue
        
        file = "../scripts/" + step["source"]
        lines = open(file).readlines()

        positions = [lines.index(line) for line in lines if line in ["/**\n", "**/\n"]]

        if len(positions) == 0:
            continue

        file_header = ""

        for ii in range(positions[0]+1, positions[1], 1):
            file_header = file_header + lines[ii]
        # read only the header

        head_as_dict = yaml.load(file_header,  Loader = yaml.loader.SafeLoader)
    
        if ("params" in head_as_dict.keys()):
            continue

        step["params"] = head_as_dict["params"]

        built_file = "src/hal9/data/"+step["function"]+".js"
        json.dump(step, open(built_file, 'w'))
