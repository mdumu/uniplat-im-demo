export namespace RootStore {
    export const STATE_ROOT_STATE = "rootState"
    export type STATE_ROOT_STATE = boolean
}

export interface RootStoreState {
    [RootStore.STATE_ROOT_STATE]: RootStore.STATE_ROOT_STATE
}
