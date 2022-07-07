<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<link rel="stylesheet" href="https://unpkg.com/buefy/dist/buefy.min.css">
<script src="https://unpkg.com/buefy/dist/buefy.min.js"></script>



<div class="paragraphiContainer">
  <template>
    <section>
        <b-message 
            title="Success with icon" 
            type="is-success" 
            has-icon 
            aria-close-label="Close message">.
        </b-message>
    </section>
  </template>
</div>


<script>
/**
  input: [text]
  params:
    - name: header
      label: Header Name
      value:
        - control: textbox
          value: paragraph
    - name: paramText
      label: Paragraph Text
      value:
        - control: textbox
          value: here goes the text
  output: [  html ]
**/

if(text == "undefined" || text == null){
  text = paramText
}
  var app = new Vue({
    el: html.getElementsByClassName('paragraphiContainer')[0],
    data: {
    },
    methods: {
      numChange(e){
      }
    }
  })
  
  //header text 
  document.getElementsByClassName("message-header")[0].getElementsByTagName("p")[0].innerText = header
 //paragraph text 
 document.getElementsByClassName("media-content")[0].innerText = text
 html.style.height = 'auto';
</script>