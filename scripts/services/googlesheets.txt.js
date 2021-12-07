/**
  input: []
  params:
    - name: url
      label: 'Google sheets page URL'
      value:
        - control: 'textbox'
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/


url = url.replace("https://docs.google.com/spreadsheets/d/","")
url = url.split("/edit#gid=")

url = "https://docs.google.com/spreadsheets/d/"+url[0]+"/export?format=csv&gid="+url[1]

var data= aq.fromCSV(await fetch(url).then(res => res.text())); 

