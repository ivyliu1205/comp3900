import { apiPost, apiGet } from './api'
import {
  loginSubPath,
  registerinSubPath,
  changePasswordSubPath,
  getUserProfileSubPath,
  refreshAuthSubPath
} from '../config'
import { devConfigAssumesLogined } from '@/dev_config'
import loginManager from './loginManager'
import { debugProfileDetails } from '@/debug_data'

async function requestLogin (json) {
  const res = await apiPost(loginSubPath, json, false)
  if (res.hasError) {
    console.log('Error: login')
  } else {
    loginManager.updateToken(res.data["token"])
  }
  return res
}

async function requestRegister (json) {
  const res = await apiPost(registerinSubPath, json, false)
  if (res.hasError) {
    console.log('Error: register')
  } else {
    loginManager.updateToken(res.data["token"])
  }
  return res
}

async function requestLogout() {
  loginManager.revokeToken()
  return true
    // const res = await apiPost(logoutSubPath, false);
    // if(res.hasError){
    //     console.log("Error: logout");
    // }
    // return res;
}

async function requestChangePassword (json) {
  const res = await apiPost(changePasswordSubPath, json, true)
  if (res.hasError) {
    console.log('Error: change password')
  }
  return res
}

async function requestGetUserProfile () {
  const res = await apiGet(getUserProfileSubPath, true)
  if (res.hasError) {
    console.log('Error: get user profile')
  }

  if (devConfigAssumesLogined && res.tryReplaceData(debugProfileDetails)) {
    console.log('Use debug')
  }
  return res
}

async function requestRefreshAuth () {
  const res = await apiPost(refreshAuthSubPath, {}, true)
  if (res.hasError) {
    console.log('Error: validate error')
  }
  if (devConfigAssumesLogined && res.tryReplaceData({"a":"a"})) {
    console.log('Use debug')
  }
  return res
}

export default {
  requestLogin,
  requestRegister,
  requestLogout,
  requestChangePassword,
  requestRefreshAuth,
  requestGetUserProfile
}
