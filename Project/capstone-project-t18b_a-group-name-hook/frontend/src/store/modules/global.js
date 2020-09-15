import ExploreService from '@/services/exploreService'
import Helper from '@/helper'
import { sleep } from '../../helper'
// state
const state = () => ({
  msg: null, //  {type: String, content: String, timeout: Number}
  loading: false, // Boolean
  loadingCount: 0, // Boolean
  labels: {} // Labels
})

function generateNameLabelMap (labels, map, parents = []) {
  if (Array.isArray(labels)) {
    for (const item of labels) {
      if (item.name in map) {
        console.warn('Duplicate item')
        continue
      }
      map[item.name] = { ...item, categories: parents }
    }
    return
  }
  Object.entries(labels).forEach(kp => {
    generateNameLabelMap(kp[1], map, [...parents, kp[0]])
  })
  return map
}

function getIngredientMap (map) {
  return Object.keys(map)
    .filter(v => map[v].categories[0] === 'ingredients')
    .reduce((res, key) => {
      res[key] = { ...map[key], category: map[key].categories[1] }
      return res
    }, {})
}

// getters
const getters = {
  initCompleted (s) {
    return Object.keys(s.labels).length === 0
  },
  labelMap (s) {
    return generateNameLabelMap(s.labels, {})
  },
  ingredientHierarchy (s) {
    const res = 'ingredients' in s.labels ? { ...s.labels['ingredients'] } : {}
    for (const k of Object.keys(res)) {
      if (res[k].length === 0) {
        delete res[k]
      }
    }
    return res
  },
  ingredientMap (s, g) {
    return getIngredientMap(g.labelMap)
  },
  ingredientNames (s, g) {
    return Object.keys(g.ingredientHierarchy)
  },
  utensilMap () {
    return []
  },
  mealTypeMap (s) {
    return 'mealTypes' in s.labels
      ? Helper.mapFromIterable(s.labels['mealTypes'])
      : {}
  },
  cuisineMap (s) {
    return 'cuisines' in s.labels
      ? Helper.mapFromIterable(s.labels['cuisines'])
      : {}
  }
}

// actions
const actions = {
  async fetchLabels ({ commit, dispatch }) {
    dispatch('startExecution', {
      type: 'info',
      content: 'Fetching labels...'
    })
    let res = { hasError: true }

    for (let i = 0; i < 5 && res.hasError; ++i) {
      res = await ExploreService.fetchLabels()
      if (res.hasError) {
        commit('setMsg', {
          type: 'info',
          content: 'Error in fetching labels. Retrying...'
        })
      }
      sleep(i * 1000)
    }

    if (res.hasError) {
      dispatch('endExecution', {
        type: 'error',
        content: 'There is error fetching labels. please reload the page'
      })
    } else {
      dispatch('endExecution')
      commit('setLabels', res.data)
    }
  },
  startExecution ({ commit }, msg) {
    commit('setMsg', msg === undefined ? null : msg)
    commit('startLoading')
  },
  endExecution ({ commit }, msg) {
    commit('setMsg', msg ? msg : { timeout: 0 })
    commit('endLoading')
  }
}

// mutations
const mutations = {
  setMsg (s, msg) {
    console.log(msg.content)
    s.msg = ''
    s.msg = msg
  },
  resetMsg (s) {
    s.msg = null
  },
  setLabels (s, labels) {
    s.labels = { ...labels }
  },
  startLoading (s) {
    s.loadingCount += 1
    s.loading = true
  },
  endLoading (s) {
    s.loadingCount -= 1
    if (s.loadingCount === 0) {
      s.loading = false
    }
  }
}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
