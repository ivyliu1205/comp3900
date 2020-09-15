import loginManager from '@/services/loginManager'
import ProfileService from '@/services/profileService'

// Should never save any sensitive information unless it is necessary for authentication

// state
const state = () => ({
  pathAfterLogin: null, // Not accessed by external components
  msgAfterLogin: null, // Not accessed by external components
  callbackAfterLogin: null, // Not accessed by external components
  userProfileDetails: null,
  isLogin: false,
  shouldRedirectIfNotLogin: false
})

// getters
const getters = {}

// actions
const actions = {
  async loginCheck ({ dispatch }) {
    console.log('loginCheck')
    return await dispatch('remoteLoginCheck')
  },

  async fallBackIfLogin ({ dispatch }) {
    if (!(await dispatch('remoteLoginCheck', null))) {
      return
    }

    await dispatch('route/back', '/explore', { root: true })

    dispatch(
      'endExecution',
      {
        type: 'success',
        content: 'You have already logged in',
        timeout: 4000
      },
      { root: true }
    )
  },

  async fallBackWhenNotLogin ({ state, commit, dispatch }) {
    console.log('fallBackWhenNotLogin')
    console.log(state.shouldRedirectIfNotLogin)
    // One time flag to avoid redirection upon first accessing the system
    if (!state.shouldRedirectIfNotLogin) {
      commit('setShouldRedirectIfNotLogin', true)
      return
    }
    dispatch('route/replace', '/login/', { root: true })
    commit(
      'setMsg',
      {
        type: 'warning',
        content: 'You have to log in first',
        timeout: 4000
      },
      { root: true }
    )
  },

  async register ({ state, commit, dispatch }, credentials) {
    await dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Registering...',
        timeout: -1
      },
      { root: true }
    )
    const res = await ProfileService.requestRegister(credentials)
    if (!res.hasError) {
      const path = state.pathAfterLogin || '/profile'
      const msg = state.msgAfterLogin
        ? state.msgAfterLogin
        : {
            type: 'success',
            content: 'You have registered successfully',
            timeout: 4000
          }
      commit('resetBackoffDetails')
      const callback = state.callbackAfterLogin
        ? state.callbackAfterLogin
        : () => {}
      await dispatch('route/replace', path, {
        root: true
      })
      dispatch('endExecution', msg, { root: true })
      callback()
    } else {
      dispatch(
        'endExecution',
        {
          type: 'error',
          content: `Failed to register. Please try again (Reason: ${res.err.reason})`,
          timeout: 4000
        },
        { root: true }
      )
    }
  },

  async login ({ state, commit, dispatch }, credentials) {
    await dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Logging in...'
      },
      { root: true }
    )
    const res = await ProfileService.requestLogin(credentials)
    if (!res.hasError) {
      const path = state.pathAfterLogin || '/profile'
      const msg = state.msgAfterLogin
        ? state.msgAfterLogin
        : {
            type: 'success',
            content: 'You have logged in successfully',
            timeout: 4000
          }
      commit('resetBackoffDetails')
      const callback = state.callbackAfterLogin
        ? state.callbackAfterLogin
        : () => {}
      await dispatch('route/replace', path, {
        root: true
      })
      dispatch('endExecution', msg, { root: true })
      callback()
    } else {
      dispatch(
        'endExecution',
        {
          type: 'error',
          content: `Failed to login. Please try again (Reason: ${res.err.reason})`,
          timeout: 4000
        },
        { root: true }
      )
    }
  },

  async logout ({ dispatch }) {
    // Invalidate the local state regardless of whether the token is valid or not
    if (!loginManager.isLogin()) {
      await dispatch('route/replace', '/', { root: true })
      dispatch(
        'endExecution',
        {
          type: 'info',
          content: 'You have not logged in (Redirected to Home Page)',
          timeout: 4000
        },
        { root: true }
      )
      return false
    }

    await dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Logging out...',
        timeout: -1
      },
      { root: true }
    )
    await ProfileService.requestLogout()
    await dispatch('route/replace', '/', { root: true })
    dispatch(
      'endExecution',
      {
        type: 'success',
        content: 'You have logged out successfully',
        timeout: 4000
      },
      { root: true }
    )

    return true
    // commit("setIsLogin", false)
    // dispatch(
    //   'startExecution',
    //   {
    //     type: 'info',
    //     content: 'Logging out...'
    //   },
    //   { root: true }
    // )
    // const res = await ProfileService.requestLogout()
    // dispatch(
    //   'endExecution',
    //   {
    //     type: res.hasError ? 'error' : 'success',
    //     content: res.hasError
    //       ? `Failed to logout (Reason: ${res.err.reason})`
    //       : state.msgAfterLogin
    //       ? state.msgAfterLogin
    //       : 'You have logged out successfully',
    //     timeout: 4000
    //   },
    //   { root: true }
    // )
  },

  async changePassword ({ dispatch }, passwordPair) {
    if (!(await dispatch('localLoginCheck', { path: '/profile' }))) {
      return
    }
    await dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Changing password...',
        timeout: -1
      },
      { root: true }
    )

    const res = await ProfileService.requestChangePassword(passwordPair)
    dispatch(
      'endExecution',
      {
        type: res.hasError ? 'error' : 'success',
        content: res.hasError
          ? `Failed to change password (Reason: ${res.err.reason})`
          : 'Your password has been changed',
        timeout: 4000
      },
      { root: true }
    )
  },

  async getUserProfile ({ dispatch, commit }) {
    if (!(await dispatch('localLoginCheck', { path: '/profile' }))) {
      return
    }
    await dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Getting your profile...',
        timeout: -1
      },
      { root: true }
    )

    const res = await ProfileService.requestGetUserProfile()
    if (!res.hasError) {
      commit('setUserProfileDetails', res.data)
    }
    const msg = res.hasError
      ? {
          type: 'error',
          content: `Failed to get your profile (Reason: ${res.err.reason})`,
          timeout: 4000
        }
      : null
    dispatch('endExecution', msg, { root: true })
  },

  async localLoginCheck ({ commit, dispatch }, backoffDetails) {
    commit('setBackoffDetails', backoffDetails)
    const login = loginManager.isLogin()
    if (!login) {
      await dispatch('fallBackWhenNotLogin')
    }
    return login
  },

  async remoteLoginCheck ({ dispatch }, backoffDetails) {
    console.log('remoteLoginCheck')
    if (!(await dispatch('localLoginCheck', backoffDetails))) {
      return false
    }
    const res = await ProfileService.requestRefreshAuth()
    const login = !res.hasError

    // if (!login) {
    //   // commit('setIsLogin', false)
    //   if (!backoffDetails) {
    //     await dispatch('fallBackWhenNotLogin', null)
    //   }
    // }
    return login
  }
}

// mutations
const mutations = {
  setBackoffDetails (s, details) {
    s.pathAfterLogin = details && 'path' in details ? details.path : null
    s.msgAfterLogin = details && 'msg' in details ? details.msg : null
    s.callbackAfterLogin =
      details && 'callback' in details ? details.callback : null
  },

  resetBackoffDetails (s) {
    s.pathAfterLogin = null
    s.msgAfterLogin = null
    s.callbackAfterLogin = null
  },

  setUserProfileDetails (s, details) {
    s.userProfileDetails = details
  },

  setIsLogin (s, login) {
    s.isLogin = login
  },

  setShouldRedirectIfNotLogin (s, val) {
    s.shouldRedirectIfNotLogin = val
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
