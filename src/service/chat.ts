import { config } from '@/config'
import { ServiceType } from '@/customer-service/model'
import { ns } from '@/customer-service/store'
import { ChatStore } from '@/customer-service/store/model'
import Chat from '@/customer-service/xim'
import store from '@/store'
import { throttle } from 'lodash'
import { sdk } from './sdk'

export function initChat() {
    console.log('初始化chat')
    return Chat.setup({
        sdk: () => sdk.core,
        orgId: () => sdk.orgId,
        connection: config.uniplatSocketUrl,
        serviceType: ServiceType.Frontend,
    }).then(() => {
        console.log('初始化chat✅  开始获取和监听消息列表')
        return initChatMsg()
    })
}
/**
 * 初始化消息列表
 */
export async function initChatMsg() {
    /** 注册基础事件 */
    await store.dispatch(`${ns}/${ChatStore.ACTION_REGISTER_EVENT}`)
    /** 注册新消息刷新列表事件 */
    await store.commit(`${ns}/${ChatStore.MUTATION_SAVE_FUNC_ON_NEW_MSG}`, fetchChatList)
    /** 第一次加载消息列表 */
    fetchChatList()
}

export const fetchChatList = throttle(() => {
    console.log('fetchChatList')
    /** 获取im会话列表 */
    store.dispatch(`${ns}/${ChatStore.ACTION_GET_MY_CHAT_LIST}`)
}, 1000 * 2)
