import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import 'font-awesome/css/font-awesome.min.css' ;
import 'element-ui/lib/theme-chalk/index.css';
import VueCompositionApi from "@vue/composition-api";
import router from "./router/index";
import ElementUI from 'element-ui';
//自定义全局组件

Vue.use(VueCompositionApi)
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
