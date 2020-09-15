import axios from 'axios'
import { timeout, baseUrl } from '../config'

import loginManager from './loginManager'
import { devConfigAssumesLogined } from '@/dev_config'
import { ApiResult } from '@/types'

import eventBus from '@/virtual/event_bus.js'

axios.interceptors.response.use(
  function (response) {
    console.log(`Response: `)
    return new ApiResult(false, response)
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (
      error.response !== undefined &&
      error.response.status === 401 &&
      !devConfigAssumesLogined
    ) {
      loginManager.revokeToken()
      eventBus.$emit('onRemoteAuthFail')
    }
    console.log(`Error: `) 
    return Promise.reject(new ApiResult(true, error))
  }
)

// const getAuthHeader = loginManager.getHttpAuthHeader

function constructConfig (auth = false, cancelToken = null, headers = null) {
  const config = {
    baseURL: baseUrl,
    timeout: timeout,
    headers: {},
    withCredentials: true
  }
  if (cancelToken !== null) {
    config.cancelToken = cancelToken
  }

  /* Use withCredential instead */
  if (auth) {
    config.headers.Authorization = loginManager.isLogin
      ? loginManager.getToken()
      : ''
  }
  if (headers) {
    config.headers = {
      ...config.headers,
      ...headers
    }
  }
  // console.log(`http request custom config: ${JSON.stringify(config)}`)
  return config
}

async function apiGet (
  subPath,
  includeAuth = false,
  cancelToken = null,
  headers = null
) {
  const config = constructConfig(includeAuth, cancelToken, headers)
  return await axios.get(subPath, config).catch(err => err)
}

async function apiPost (
  subPath,
  data,
  includeAuth = false,
  cancelToken = null,
  headers = null
) {
  const config = constructConfig(includeAuth, cancelToken, headers)
  return await axios.post(subPath, data, config).catch(err => err)
}
export { apiGet, apiPost }
