import yaml

yaml.load(open("D:\hal9ai5\scripts\import\json.js"), Loader = yaml.loader.SafeLoader) 

linhas = open("D:\hal9ai5\scripts\import\json.js").readlines()

positions = [linhas.index(line) for line in linhas if line in ["/**\n", "**/\n"]]

file_header = ""
for ii in range(positions[0]+1, positions[1], 1):
    file_header = file_header + linhas[ii]

yaml.load(file_header,  Loader = yaml.loader.SafeLoader)

    
