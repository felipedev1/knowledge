import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

//TEMPORARIO 

require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwibmFtZSI6Ikxlb25hcmRvIExlaXTDo28iLCJlbWFpbCI6ImxlaXRhb0Bjb2Qzci5jb20uYnIiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTg4NTQ1NjEyLCJleHAiOjE1ODg4MDQ4MTJ9.CQVNezNlxqMOwcB3pmH-v0GrtJ9CnIzYw0Nm7CiuW94'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')