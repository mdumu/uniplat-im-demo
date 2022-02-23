import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { filters } from './utils/filter'
import moment from 'moment'
import './assets/css/flex.less'
import './assets/css/layout.less'

Vue.use(filters)

Vue.config.productionTip = false
Vue.use(element)

moment.updateLocale('zh-cn', {
    meridiem: function (hour, minute) {
        if (hour < 9) {
            return '早上'
        } else if (hour < 11 && minute < 30) {
            return '上午'
        } else if (hour < 13 && minute < 30) {
            return '中午'
        } else if (hour < 18) {
            return '下午'
        } else {
            return '晚上'
        }
    },
})

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
