import Vue from 'vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies'
import App from './App.vue'

import helper from './helper';

Vue.use(VueCookies)

if(helper.stopLogging) {
    console.warn("Logging is disabled");
    console.log = function() {}
}
 
Vue.config.productionTip = false

new Vue({
    vuetify,
    store,
    router,
    helper,
    // template: App,
    render: h => h(App),
}).$mount('#app')