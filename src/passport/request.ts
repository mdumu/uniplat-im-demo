/* eslint-disable */

import axios from 'axios'

// create an axios instance
const service = axios.create({
    timeout: 5000,
})

service.interceptors.request.use(
    (config: any) => {
        config.headers.Authorization = localStorage.JWT_TOKEN || ''

        return config
    },
    (error: any) => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: any) => {
        const res = response.data
        if (res.rescode !== 0) {
            console.log(res.msg || 'Error')
            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            return res.data
        }
    },
    (error: string) => {
        return Promise.reject(error)
    }
)

export default service
