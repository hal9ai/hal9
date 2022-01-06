/**
  params:
    - name: field
      label: Field
      single: true
    - name: dtype
      label: 'Data type'
      value:
        - control: 'select'
          value: ''
          values:
            - name: int
              label: Integer
            - name: float
              label: Float
            - name: string
              label: String
            - name: date
              label: Date
            - name: bool
              label: Boolean

    - name: charac
      label: Remove Characters
      value:
        - control: 'textbox'


  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/


data = await hal9.utils.toArquero(data);

//int conversion
  if(dtype=='int'){

var vals = Array.from(data.values(field));
for (const v in vals){
  if (typeof vals[v] === 'string') {
  if(vals[v].includes(' ') || vals[v].includes(',') || vals[v].includes(charac)){
    vals[v]= vals[v].replace(/ /g,'')
vals[v]= vals[v].replace(/,/g,'')
  vals[v]= vals[v].replace('$','')

var reg = new RegExp(charac, "g");
vals[v]=vals[v].replace(reg, "");


  }
  }
  vals[v]=parseInt(vals[v])
  }

 data =data.assign({field:vals})
 data = data.rename({ field : field });

  }
  //float conversion
  else if (dtype=='float'){
  var vals = Array.from(data.values(field));
for (const v in vals){
  if (typeof vals[v] === 'string') {

  if(vals[v].includes(' ') || vals[v].includes(',')|| vals[v].includes(charac)){
    vals[v]= vals[v].replace(/ /g,'')
  vals[v]= vals[v].replace(/,/g,'')
  vals[v]= vals[v].replace('$','')
  var reg = new RegExp(charac, "g");
vals[v]=vals[v].replace(reg, "");


  }
  }
  vals[v]=parseFloat(vals[v])
  }
 data =data.assign({col:vals})
 data = data.rename({ col : field});

  }
//date conversion
  else if (dtype=='date'){
        data = data.params({field}).derive({ column: aq.escape((data, $) => new Date(data[$.field])) });
data = data.rename({ column : field });
  }
//string conversion
  else if (dtype=='string'){
    
    data = data.params({field}).derive({ column: aq.escape((data, $) => String(data[$.field])) });
data = data.rename({ column : field });
  }
//bool conversion
  else if (dtype=='bool'){
    var boolvalsf=['0',0,'zero','null',null,'NULL','f',"NaN","FALSE"]
boolvalsf.push(charac)

var vals = Array.from(data.values(field));

for (const v in vals){
  if(boolvalsf.includes(vals[v])){
    vals[v]=false;
  }
  else{
    vals[v]=true
  }
  }

  data =data.assign({field:vals})
 data = data.rename({ field : field });


}





