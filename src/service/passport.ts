import { config } from '@/config'
import axios from 'axios'
import qs from 'qs'

const baseAuthParams = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
}

export interface TokenResponse {
    access_token: string
}

function getAnonymousToken() {
    return axios
        .post<TokenResponse>(
            `${config.passportUrl}/connect/token`,
            qs.stringify({
                ...baseAuthParams,
                grant_type: 'anonymous',
                scope: 'api.workapps.open',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        .then((r) => r.data.access_token)
}

export function getPassportTokenByPassport(username: string, password: string) {
    return getAnonymousToken().then((token) => {
        return axios
            .post<TokenResponse>(
                `${config.passportUrl}/connect/token`,
                qs.stringify({
                    ...baseAuthParams,
                    grant_type: 'password',
                    scope: 'openid workapps.client api.workapps.open api.workapps.user',
                    username,
                    password,
                }),
                {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        Authorization: 'Bearer ' + token,
                    },
                }
            )
            .then((r) => r.data.access_token)
    })
}
