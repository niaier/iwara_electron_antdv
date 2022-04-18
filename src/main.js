import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'common-css-js';
import VueKeepRatio from "vue-keep-ratio";
import Storage from 'vue-ls'

// vue-ls 的配置
const storageOptions = {
  namespace: 'iwara_',   // key 键的前缀（随便起）
  name: 'ls',          // 变量名称（随便起） 使用方式：Vue.变量名称 或 this.$变量名称
  storage: 'local'     // 作用范围：local、session、memory
}

Vue.use(Storage, storageOptions)


Vue.use(VueKeepRatio);

Vue.use(Antd)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
