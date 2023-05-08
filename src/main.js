import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ajax from '@/api/ajax';
import VueRouter from 'vue-router';

import DeviceType from '@/components/DeviceType';
import DeviceTypeList from '@/components/DeviceTypeList';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);

Vue.prototype.$http = ajax;

// const Home = { template: '<div>Home</div>' }
// const About = { template: '<div>About</div>' }


const routes = [
  { path: '/', component: DeviceType },
  { path: '/about', component: DeviceTypeList }
];
const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
