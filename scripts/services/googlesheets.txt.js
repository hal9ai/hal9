/**
  input: []
  params:
    - name: gid
      label: 'Google sheets page gid'
      value:
        - control: 'textbox'
    - name: id
      label: 'Google sheets id'
      value:
        - control: 'textbox'

  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
**/



var url = "https://docs.google.com/spreadsheets/d/e/"+id+"/pub?gid="+gid+"&single=true&output=csv"

var data= aq.fromCSV(await fetch(url).then(res => res.text()));
