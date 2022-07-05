<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<link rel="stylesheet" href="https://unpkg.com/buefy/dist/buefy.min.css">
<script src="https://unpkg.com/buefy/dist/buefy.min.js"></script>

<div class="numberBoxContainer">
<template>
    <b-field class="file is-primary" :class="{'has-name': !!file}">
      <b-upload v-model="file" class="file-label" @change.native="numChange">
        <span class="file-cta">
            <b-icon class="file-icon" icon="upload"></b-icon>
              <span class="file-label">Click to upload</span>
            </span>
            <span class="file-name" v-if="file">{{ file.name }}</span>
      </b-upload>
    </b-field>
</template>
</div>


<script>
/**
  input: []
  params:
    - name: dataType
      label: 'Upload your data as '
      value:
        - control: select
          value: base
          values:
            - name: base
              label: Base64
            - name: txt
              label: Text
            - name: arrbuff
              label: Array Buffer
            - name: binstring
              label: Binary String
  output: [  html,inputFile ]
**/
  var state = hal9.getState();
  state = state ? state : {};
  var inputFile = '';
  if (state.inputFile) {
    inputFile = state.inputFile;
    value = inputFile;
  }

  var app = new Vue({
    el: html.getElementsByClassName('numberBoxContainer')[0],
    data: {
      file: null,
    },
    methods: {
      numChange(e){
        const reader = new FileReader()
        reader.onload = async (e) => {
          const text = (e.target.result);
          state.inputFile = text
          hal9.setState(state);
          hal9.invalidate();
      };
      if(dataType == 'base'){
        reader.readAsDataURL(e.target.files[0]);
      }
      else if(dataType == 'txt'){
        reader.readAsText(e.target.files[0]);
      }
      else if(dataType == 'arrbuff'){
        reader.readAsArrayBuffer(e.target.files[0]);
      }
      else if(dataType == 'binstring'){
        reader.readAsBinaryString(e.target.files[0]);
      }
      }
    }
  })
  html.style.height = 'auto';
</script>