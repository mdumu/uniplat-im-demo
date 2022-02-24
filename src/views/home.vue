<template>
    <div>
        <div v-for="item in chatList" :key="item.id" @click="openChat(item)">
            <div>{{ item.title }}</div>
            <div>{{ (item.last_msg_ts * 1000) | time2Relative }}</div>
        </div>

        <el-drawer
            :title="chatTitle || '加载中...'"
            :visible.sync="dislogVisible"
            @close="clearCurrentChatId"
            :size="600"
        >
            <div class="chat" v-loading="!chatTitle">
                <!-- @/customer-service 中的组件 -->
                <chat-room />
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts">
    import { Component } from "vue-property-decorator"
    import { getPassportTokenByPassport } from "@/service/passport"
    import { config } from "@/config"
    import ChatList from "@/customer-service/components/controller/chat-list"
    import { initChat } from "@/service/chat"
    import { sdk } from "@/service/sdk"
    import { Chat } from "@/customer-service/xim/models/chat"
    import { ChatStore, chatStore } from "@/customer-service/store/model"
    import ChatRoom from "@/customer-service/components/chat-room.vue"
    @Component({
        components: { ChatRoom },
    })
    export default class HomeView extends ChatList {
        private dislogVisible = false
        @chatStore.State(ChatStore.STATE_CURRENT_CHAT_TITLE)
        private chatTitle!: ChatStore.STATE_CURRENT_CHAT_TITLE

        mounted() {
            this.init()
        }

        private openChat(item: Chat) {
            this.dislogVisible = true
            this.saveChatId(item.id)
        }

        private init() {
            // 登录统一认证中心passport
            return getPassportTokenByPassport(config.testAccount, config.testPassword)
                .then((token) => {
                    // 使用passport Token初始化sdk
                    return sdk.setup(token)
                })
                .then(() => {
                    // sdk初始化完后，chat使用全局sdk实例去初始化会话链接以及会话列表
                    return initChat()
                })
        }
    }
</script>

<style scoped lang="less">
    .chat {
        height: 100%;
        /deep/.chat-room-con {
            height: 100%;
            .h-100 {
                height: 100%;
            }
            .content-avatar {
                margin-top: 10px;
            }
            .tm-avatar {
                margin-left: 10px;
            }
            .cs-flex-direction {
                justify-content: flex-end;
                .tm-avatar {
                    margin-left: 0;
                    margin-right: 10px;
                }
            }
            .msg-detail {
                margin-top: 0;
            }
            .withdraw-message {
                background-color: transparent;
                padding: 0 4px;
                font-size: 12px;
                color: #999;
            }
            .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            .chat-area .chat-messages {
                height: calc(100% - 180px + 1px);
            }
            .chat-room-con {
                height: 100%;
            }
        }
    }
</style>
