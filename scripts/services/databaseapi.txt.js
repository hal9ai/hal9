/**
  input: []
  params:
    - name: url
      label: 'database api'
      value:
        - control: 'textbox'
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/

console.log("URL ",url)
var data= await fetch(url,{
  method:"GET",
}).then(res => res.json());  

data = aq.from(data)
