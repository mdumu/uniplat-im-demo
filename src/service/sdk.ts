import { metaRow, SdkListRowPredict, SdkListRowPredictObject, UniplatSdk, UniplatSdkExtender } from 'uniplat-sdk'
import { config } from '@/config'

class Sdk {
    private uniplatSdk!: UniplatSdk
    private readonly handler = new UniplatSdkExtender()
    private token!: string
    public orgId!: string

    constructor() {
        // 从config获取目标服务器
        const baseUrl = config.uniplatApi
        // 生成uniplat实例
        this.uniplatSdk = new UniplatSdk({ sse: false })
        // 传入目标服务器以链接服务器
        this.uniplatSdk.connect({
            baseUrl: baseUrl,
            axiosTimeout: 2e3,
        })
    }

    public setup(token: string) {
        this.token = 'Bearer ' + token
        // 设置实例根入口程序
        this.uniplatSdk.global.rootEntrance = config.rootEntrance
        // 添加Token过期时的回调
        this.uniplatSdk.events.addTokenExpiring(() => {
            console.log('token过期了')
        })
        // 传入token登录业务平台
        return this.uniplatSdk
            .getPassportLogin()
            .login(this.token)
            .then(() => {
                return this.uniplatSdk
                    .org()
                    .loadList({ name: '', itemIndex: 0, itemSize: 10 })
                    .then((org) => {
                        if (org.list.length) {
                            this.orgId = String(org.list[0].id)
                            this.uniplatSdk.setInitData({
                                orgId: org.list[0].id,
                            })
                        } else {
                            throw Error('no Org')
                        }
                    })
            })
    }

    public get core() {
        return this.uniplatSdk
    }

    public buildRows<T>(rows: metaRow[], predicts: SdkListRowPredict[] | SdkListRowPredictObject) {
        return this.handler.buildRows<T>(rows, predicts)
    }

    public buildRow<T>(item: metaRow, predicts: SdkListRowPredict[] | SdkListRowPredictObject) {
        return this.handler.buildRow<T>(item, predicts)
    }

    public buildActionParameter(parameter: { [key: string]: any }) {
        return this.handler.buildActionParameter(parameter)
    }
}

const sdk = new Sdk()

export { sdk }
