import {reactive} from 'vue'

export const store = reactive({
    log_auth: false,
    username: '',
    setAuth(is_authed){
        this.log_auth = is_authed
    },
    setUsername(username){
        this.username = username;
    }
})