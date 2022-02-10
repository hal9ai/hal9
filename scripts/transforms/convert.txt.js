/**
  params:
    - name: field
      label: Field
      single: true
    - name: dataType
      label: 'Data type'
      value:
        - control: 'select'
          value: ''
          values:
            - name: int
              label: Integer
            - name: float
              label: Decimal
            - name: string
              label: String
            - name: date
              label: Date
            - name: bool
              label: True/False
    - name: charactersToRemove
      label: Remove Characters
      value:
        - control: 'textbox'
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js 
**/


data = await hal9.utils.toArquero(data);
let values;

//int conversion
if ((dataType === 'int') || (dataType === 'float') ){
  values = data.array(field).map(value => {
    let result = value;
    if (typeof result === 'string') {
      result = result.replaceAll(' ', '');
      result = result.replaceAll(',', '');
      result = result.replaceAll('$', '');
      result = result.replaceAll(new RegExp(charactersToRemove, 'g'), '');

      if (dataType === 'int') {
        result = parseInt(result);
      } else if (dataType === 'float') {
        result = parseFloat(result);
      }
    }
    return result;
  });
}
//date conversion
else if (dataType === 'date') {
  values = data.array(field).map(value => {
    return new Date(value);
  });
}
//string conversion
else if (dataType === 'string') {
  values = data.array(field).map(value => {
    return String(value);
  });
}
//bool conversion
else if (dataType === 'bool') {
  values = data.array(field).map(value => {
    if (typeof value === 'string') {
      value = value.replaceAll(new RegExp(charactersToRemove, 'g'), '');
      value = value.trim().toLowerCase();
      const falseStrings = ['', '0', '0.0', '-0', '0n', 'false', 'null', 'undefined', 'nan'];
      return !(falseStrings.includes(value));
    } else {
      return Boolean(value);
    }
  });
}

data = data.assign({ field: values });
data = data.rename({ field: field });
