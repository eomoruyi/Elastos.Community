import {createContainer} from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'

export default createContainer(Component, (state) => {
    return {}
}, () => {
    const userService = new UserService()

    return {
        async getMember(userId) {
            return userService.getMember(userId)
        }
    }
})
