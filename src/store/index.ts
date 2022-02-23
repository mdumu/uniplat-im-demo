import Vue from 'vue'
import Vuex from 'vuex'
import { RootStore, RootStoreState } from './model'
import chatStore, { ns as chatStoreNs } from '@/customer-service/store/index'
Vue.use(Vuex)

export default new Vuex.Store<RootStoreState>({
    state: {
        [RootStore.STATE_ROOT_STATE]: true,
    },
    modules: { [chatStoreNs]: chatStore },
})
