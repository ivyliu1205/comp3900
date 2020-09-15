import exploreService from '@/services/exploreService'
import { isMatchQuery } from '@/helper'
import Vue from 'vue'

function formatRequestBodyForMatchedRecipes (
  selectedIngredientMap,
  cookingTime
) {
  const m = {
    ingredients: Object.keys(selectedIngredientMap).map(key => ({
      name: key
    })),
    maxTime: cookingTime
  }
  return m
}

// initial state
const state = () => ({
  query: '',
  selectedIngredientMap: {}, // Object<name, name>
  cookingTime: null,
  checkedCategoryMap: {},
  matchedRecipes: [],
  suggestedIngredientNames: [], // Arr<name>
  shouldDisplayRecipes: false
})

// getters
const getters = {
  hasSelectedLabels (s, g) {
    return Object.keys(g.selectedLabelMap).length > 0
  },
  hasSearchParameters () {
    return true
  },

  selectedLabelMap (s, g, rs, rg) {
    const m = {}
    for (const k of Object.keys(s.selectedIngredientMap)) {
      m[k] = rg.labelMap[k]
    }
    return m
  },

  filteredIngredientNames (s, g, rs, rg) {
    if (s.query === null || s.query === '') {
      return []
    }
    return Object.keys(rg.ingredientMap).filter(k => {
      return isMatchQuery(k, s.query)
    })
  },
  filteredIngredientHierarchy(s, g, rs, rg) {
    if (s.query === null || s.query === '') {
      return rg.ingredientHierarchy
    }
    const hierarchy = {}
    for (const k in rg.ingredientHierarchy) {
      const matchedIngredients = rg.ingredientHierarchy[k].filter(item => isMatchQuery(item.name, s.query))
      if(matchedIngredients.length > 0) {
        hierarchy[k] = matchedIngredients
      }
    }
    return hierarchy
  },

  sortedFilteredIngredientNames (s, g) {
    let res = [...g.filteredIngredientNames]
    res.sort()
    return res
  },

  matchedRecipeMap (s) {
    return s.matchedRecipes.reduce((res, recipe) => {
      res[recipe.id] = recipe
      return res
    }, {})
  },

  selectedIngredientNames (s) {
    return Object.keys(s.selectedIngredientMap)
  },

  filteredSuggestedIngredients (s, g, rs, rg) {
    return s.suggestedIngredientNames
      .filter(name => {
        return name in rg.labelMap && !(name in s.selectedIngredientMap)
      })
      .map(name => rg.labelMap[name])
  }
}

// actions
const actions = {
  activateSearch ({ getters, commit, dispatch }) {
    if (!getters.hasSearchParameters) return
    dispatch('fetchMatchRecipes')
    commit('setShouldDisplayRecipes', true)
  },


  async fetchMatchRecipes ({ state, commit, rootGetters, dispatch }) {
    dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Searching recipes...'
      },
      { root: true }
    )
    const requestBody = formatRequestBodyForMatchedRecipes(
      state.selectedIngredientMap,
      state.cookingTime,
      rootGetters.labelMap
    )

    const res = await exploreService.fetchMatchedRecipes(requestBody)
    if (!res.hasError) {
      console.log(JSON.stringify(res.data));
      commit('setMatchedRecipeDetails', res.data)
    }
    dispatch(
      'endExecution',
      res.hasError
        ? null
        : {
            type: 'error',
            content: 'Fails to fetch result'
          },
      { root: true }
    )
  },

  accessRecipeDetails ({ dispatch }, recipeId) {
    return dispatch('route/toExploreRecipeDetails', recipeId, { root: true })
  },

  async fetchRecipeDetails ({ getters, commit, dispatch }, recipeId) {
    if (recipeId in getters.matchedRecipeMap) {
      return
    }

    dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Getting recipe details...'
      },
      { root: true }
    )
    const res = await exploreService.fetchRecipeDetails(recipeId)
    if (res.hasError) {
      dispatch(
        'endExecution',
        {
          type: 'error',
          content: 'Fails to get recipe details'
        },
        { root: true }
      )
    } else {
      dispatch('endExecution', null, { root: true })
      commit('addRecipeDetails', res.data)
    }
  },

  addIngredientAndSearch ({ commit, dispatch }, ingredient) {
    commit('addSelectedIngredient', ingredient.name)
    dispatch('fetchMatchRecipes')
  },

  removeIngredientAndSearch ({ commit, dispatch }, name) {
    commit('removeLabel', name)
    dispatch('fetchMatchRecipes')
  },

  updateCookingTimeAndSearch ({ commit, dispatch }, v) {
    commit('setCookingTime', v)
    dispatch('fetchMatchRecipes')
  },

  resetCookingTimeAndSearch ({ commit, dispatch }) {
    commit('setCookingTime', null)
    dispatch('fetchMatchRecipes')
  },

  unselectLabel ({ commit }, id) {
    commit('removeLabel', id)
  },

  unselectAllIngredients ({ commit }) {
    commit('clearIngredientSelection')
  },

  async clearSelection ({ commit, dispatch }) {
    await commit('resetCookingTime')
    dispatch('unselectAllIngredients')
  }
}

// mutations
const mutations = {
  reset (s) {
    const os = state()
    for (const k in s) {
      s[k] = os[k]
    }
  },

  resetSelection (s) {
    s.selectedIngredientMap = {}
    s.cookingTime = null
  },

  addSelectedIngredient (s, name) {
    Vue.set(s.selectedIngredientMap, name, name)
  },

  removeLabel (s, name) {
    if (name in s.selectedIngredientMap) {
      Vue.delete(s.selectedIngredientMap, name)
    }
  },

  clearIngredientSelection (s) {
    s.selectedIngredientMap = {}
  },

  setCookingTime (s, cookingTime) {
    s.cookingTime = cookingTime
  },

  resetCookingTime (s) {
    s.cookingTime = null
  },

  setMatchedRecipeDetails (s, details) {
    s.matchedRecipes = details.recipes || []
    s.suggestedIngredientNames = details.suggestedIngredients || []
  },

  clearMatchedRecipeDetails (s) {
    s.matchedRecipes = []
    s.suggestedIngredientNames = []
  },

  setQuery (s, term) {
    s.query = term
  },

  clearQuery (s) {
    s.query = ''
  },

  setShouldDisplayRecipes (s, v) {
    s.shouldDisplayRecipes = v
  },

  addRecipeDetails (s, recipe) {
    s.matchedRecipes.push(recipe)
  },

  updateCheckedCategory(s,details) {
    Vue.set(s.checkedCategoryMap,details.category,details.toOn)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
