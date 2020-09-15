import Vue from 'vue'
import Vuex from 'vuex'
import {createLogger} from 'vuex'
import global from './modules/global'
import explore from './modules/explore'
import route from './modules/route'
import profile from './modules/profile'
import contribution from './modules/contribution'

import dev_config from '@/dev_config'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    global,
    route,
    explore,
    profile,
    contribution,
  },
  strict: dev_config.devConfigEnforceStrictStateChange,
  plugins: dev_config.devConfigUseStateChangeLogger ? [createLogger()] : []
})