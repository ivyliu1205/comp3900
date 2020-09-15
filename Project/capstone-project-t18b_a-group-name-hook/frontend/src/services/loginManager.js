import Vue from 'vue'
import {devConfigAssumesLogined} from "@/dev_config"
import { tokenKey} from "@/config"
import eventBus from '@/virtual/event_bus.js';


function updateToken(token) {
    if(token !== null) {
        console.log(`Update token: ${token}`);
        Vue.$cookies.set(tokenKey, JSON.stringify(token), Infinity)
        eventBus.$emit('updateToken')
    } 
    return token !== null
}  

function revokeToken() {
    console.log(`Revoke token ${ Vue.$cookies.isKey(tokenKey) ? Vue.$cookies.get(tokenKey): null}`);
    Vue.$cookies.remove(tokenKey)
    eventBus.$emit('revokeToken')
    return true
} 


function getToken() {
    const token = Vue.$cookies.isKey(tokenKey) ? Vue.$cookies.get(tokenKey): null;
    console.log(`Get token ${token}`);
    if(Vue.$cookies.isKey(tokenKey)) {
        
        eventBus.$emit('updateToken')
        return Vue.$cookies.get(tokenKey)
    }
    eventBus.$emit('revokeToken')
    return null
}

function isLogin() {
    return devConfigAssumesLogined || getToken() !== null;
}


export { isLogin, updateToken, revokeToken, getToken};
export default { isLogin,updateToken, revokeToken, getToken,};