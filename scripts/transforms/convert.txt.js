/**
  description: Use this block to do some quick data type conversions
  params:
    - name: field
      label: Column
      single: true
      description: The name of the column to convert
      static: false
    - name: dataType
      label: 'Data type'
      static: true
      description: The target data type
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
            - name: time
              label: Time

    - name: timeConverter
      label: 'Convert Date/Time'
      static: true
      description: an optional parameter to help convert date-times
      value:
        - control: 'select'
          value: ''
          values:
            - name: seconds_hours
              label: Seconds to Hours
            - name: hours_seconds
              label: Hours to Seconds
            - name: hours_miliseconds
              label: Hours to Miliseconds
            - name: unixDate
              label: Unix to DateTime



    - name: charactersToRemove
      label: Remove Characters
      static: true
      description: a string of characters to remove
      value:
        - control: 'textbox'
          value: ''


  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
  output: [data]
**/


data = await hal9.utils.toArquero(data);
let values;

//int conversion
if ((dataType === 'int') || (dataType === 'float')) {
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
    else if (typeof result.getMonth === 'function') {
      result = result.getTime();
    }
    return result;
  });
}
//date conversion
else if (dataType === 'date') {
  values = data.array(field).map(value => {
    if (timeConverter == 'unixDate') {
      return new Date(value * 1000);
    }
    else {
      return new Date(value);
    }
  });

}
//string conversion
else if (dataType === 'string') {
  values = data.array(field).map(value => {
    let result = String(value);
    value = result.replaceAll(new RegExp(charactersToRemove, 'g'), '');
    return value;
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
//time conversion
else if (dataType === 'time') {
  if (timeConverter === 'hours_seconds') {
    values = data.array(field).map(value => {
      let result = value;
      if (typeof (result) === 'string') {
        let [hours, minutes, seconds] = result.split(':');
        value = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
      }
      return value;
    });
  }
  else if (timeConverter === 'hours_miliseconds') {
    values = data.array(field).map(value => {
      let result = value;
      if (typeof (result) === 'string') {
        let [hours, minutes, seconds] = result.split(':');
        value = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
        value *= 1000;
      }
      return value;
    });
  }
  else if (timeConverter === 'seconds_hours') {
    values = data.array(field).map(value => {
      let result = value;
      if (typeof (result) === 'number') {
        value = new Date(result * 1000).toISOString().substr(11, 8);
      }
      return value;
    });
  }


}

if (values) {
  data = data.assign({ field: values });
  data = data.rename({ field: field });
}

