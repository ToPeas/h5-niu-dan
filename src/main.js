import Vue from 'vue'
import App from './App.vue'
import './styles/main.less'
import FastClick from 'fastclick'

Vue.config.productionTip = false

if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      FastClick.attach(document.body)
    },
    false
  )
}

new Vue({
  render: (h) => h(App),
}).$mount('#app')
