import Vue from 'vue';
import app from './app.vue';
import './styles/main.css';

(async function () {
  const vue = new Vue({
    el: '#app',
    render: (h) => h(app),
  });
})();
