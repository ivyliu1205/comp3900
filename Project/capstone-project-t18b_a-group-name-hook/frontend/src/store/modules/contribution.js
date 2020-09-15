import ContributionService from '@/services/contributionService'
import Vue from 'vue'

function ensureRecipeDetailsFormat (recipe = {}) {
  return {
    id: null,
    name: '',
    imgSrcs: [],
    ingredients: [],
    time: null,
    cuisines: [],
    mealTypes: [],
    utensils: [],
    steps: [],
    public: false,
    ...recipe
  }
}

// function ensureRecipeImageUpdateFormat (details = {}) {
//   return {
//     newImageFiles: [],
//     deleteImageUrls: [],
//     ...details
//   }
// }

// initial state
const state = () => ({
  recipeMap: {},
  focusedRecipe: null
})

// getters
const getters = {
  recipes (s) {
    return Object.values(s.recipeMap)
  },
  hasRecipes (s) {
    return Object.keys(s.recipeMap).length > 0
  },
  focusedRecipeIngredientIdQuantityMap (s) {
    return s.focusedRecipe === null
      ? {}
      : s.focusedRecipe.ingredients.reduce((map, item) => {
          map[item.id] = item.quantity
          return map
        }, {})
  }
}

// actions
const actions = {
  async getRecipes ({ dispatch, commit, rootGetters }) {
    if (
      !(await dispatch(
        'profile/localLoginCheck',
        { path: '/contribute' },
        {
          root: true
        }
      ))
    ) {
      return
    }
    dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Fetching your recipes...'
      },
      { root: true }
    )
    const res = await ContributionService.requestGetRecipes()
    if (!res.hasError) {
      
      for(const recipe of res.data) {
        recipe.ingredients = recipe.ingredients.map(item => ({...rootGetters.ingredientMap[item.name], ...item}))
      } 
      commit('setRecipes', res.data)
    }
    const msg = res.hasError
      ? {
          type: 'error',
          content: `Failed to fetch your recipes (Reason: ${res.err.reason})`,
          timeout: 4000
        }
      : null
    dispatch('endExecution', msg, { root: true })
    
  },

  async fetchRecipeDetails ({ state, dispatch, commit, rootGetters }, id) {
    if (id === 'new' || id in state.recipeMap) {
      if (
        !(await dispatch(
          'profile/remoteLoginCheck',
          {
            path: `/contribute/${id}`
          },
          { root: true }
        ))
      ) {
        return
      }
      dispatch(
        'startExecution',
        {
          type: 'info',
          content: 'Fetching the recipe detail...'
        },
        { root: true }
      )
      commit('setFocusedRecipeID', id === 'new' ? null : id)
      dispatch('endExecution', null, { root: true })
      return
    }

    if (
      !(await dispatch(
        'profile/localLoginCheck',
        { path: `/contribute/${id}` },
        { root: true }
      ))
    ) {
      return
    }
    dispatch(
      'startExecution',
      {
        type: 'info',
        content: 'Fetching the recipe detail...'
      },
      { root: true }
    )
    const res = await ContributionService.requestGetRecipeDetail(id)
    if (!res.hasError) {
      res.data.ingredients = res.data.ingredients.map(item => ({...rootGetters.ingredientMap[item.name], ...item}))
      commit('updateRecipe', ensureRecipeDetailsFormat(res.data))
      commit('setFocusedRecipeID', res.data.id)
    }
    const msg = res.hasError
      ? {
          type: 'error',
          content: `Failed to get recipe detail (Reason: ${res.err.reason})`,
          timeout: 4000
        }
      : null
    dispatch('endExecution', msg, { root: true })
  },

  async accessRecipe ({ dispatch }, id) {
    await dispatch('route/toContributionRecipeDetails', id, { root: true })
  },

  // Create recipe
  async createRecipe ({ dispatch }) {
    await dispatch('route/toContributionRecipeDetails', 'new', { root: true })
  },

  // Sync recipe in the state with the remote database
  async syncRecipe ({ commit, dispatch, rootGetters }, details) {
    let recipeId = details['id']
    const focusedRecipeContent = details['content']
    const focusedRecipeImageUpdateDetails = details['images']
    if (
      !(await dispatch(
        'profile/localLoginCheck',
        {
          path: recipeId ? `/contribute/${recipeId}` : '/contribute'
        },
        { root: true }
      ))
    ) {
      return
    }

    dispatch(
      'startExecution',
      {
        type: 'info',
        content: `Syncing update with remote database...`
      },
      { root: true }
    )

    // If the recipe is created and image has been changed, register the recipe first
    if (recipeId === null || focusedRecipeContent) {
      const recipeUpdateRes = await ContributionService.requestEditRecipe({
        ...focusedRecipeContent,
        id: recipeId
      })
      if (recipeUpdateRes.hasError) {
        dispatch(
          'endExecution',
          {
            type: 'error',
            content: `Failed to sync update with remote database (Reason: ${recipeUpdateRes.err.reason})`,
            timeout: 4000
          },
          { root: true }
        )
        return
      }

      recipeUpdateRes.data.ingredients = recipeUpdateRes.data.ingredients.map(item => ({...rootGetters.ingredientMap[item.name], ...item}))
      commit('updateRecipe', recipeUpdateRes.data)
      commit('setFocusedRecipeID', recipeUpdateRes.data.id)
      recipeId = recipeUpdateRes.data.id
    }

    // Update images
    if (focusedRecipeImageUpdateDetails) {
      const imageUpdateRes = await ContributionService.requestUpdateImages(
        recipeId,
        focusedRecipeImageUpdateDetails.newImageFiles || [],
        focusedRecipeImageUpdateDetails.deleteImageUrls || []
      )

      if (imageUpdateRes.hasError) {
        dispatch(
          'endExecution',
          {
            type: 'error',
            content: `Failed to sync image update with remote database (Reason: ${imageUpdateRes.err.reason})`,
            timeout: 4000
          },
          { root: true }
        )
        return
      }

      imageUpdateRes.data.ingredients = imageUpdateRes.data.ingredients.map(item => ({...rootGetters.ingredientMap[item.name], ...item}))
      commit('updateRecipe', imageUpdateRes.data)
      commit('setFocusedRecipeID', imageUpdateRes.data.id)
    }
    dispatch(
      'endExecution',
      {
        type: 'success',
        content: `Recipe has been updated successfully`,
        timeout: 4000
      },
      { root: true }
    )
  },

  async deleteRecipe ({ state, dispatch, commit }) {
    if (state.focusedRecipe.id !== null) {
      const idToBeDeleted = state.focusedRecipe.id
      dispatch(
        'startExecution',
        {
          type: 'info',
          content: `Deleting recipe...`
        },
        { root: true }
      )

      if (
        !(await dispatch(
          'profile/localLoginCheck',
          {
            path: `/contribution/${idToBeDeleted}`
          },
          { root: true }
        ))
      ) {
        dispatch('endExecution', msg, { root: true })
        return
      }
      const res = await ContributionService.requestDeleteRecipe(
        state.focusedRecipe.id
      )
      const msg = res.hasError
        ? {
            type: 'error',
            content: `Failed to delete recipe (Reason: ${res.err.reason})`,
            timeout: 4000
          }
        : null
      dispatch('endExecution', msg, { root: true })

      if (!res.hasError) {
        commit('deleteRecipe', idToBeDeleted)
      }
    }

    return dispatch('route/back', '/contribute', { root: true })
  }
}

// mutations
const mutations = {
  updateRecipe (s, recipe) {
    Vue.set(s.recipeMap, recipe.id, recipe)
  },

  deleteRecipe (s, id) {
    if (id in s.recipeMap) {
      Vue.delete(s.recipeMap, id)
    }
  },

  setRecipes (s, recipes) {
    s.recipeMap = recipes.reduce((res, recipe) => {
      res[recipe.id] = recipe
      return res
    }, {})
  },

  setFocusedRecipeID (s, id) {
    if (id !== null && !(id in s.recipeMap)) {
      console.error(`Focus recipe (ID:${id}) does not exist`)
      return
    }
    s.focusedRecipe =
      id === null ? ensureRecipeDetailsFormat() : { ...s.recipeMap[id] }
  },

  clearFocusedRecipeID (s) {
    s.focusedRecipe = null
  },

  updateFocusedRecipe (s, details) {
    if (!s.focusedRecipe) {
      console.error(
        'Focused recipe has not been set but is requested to be updated'
      )
      return
    }
    const id = s.focusedRecipe.id
    s.focusedRecipe = ensureRecipeDetailsFormat({ ...details, id: id })
  },

  reset (s) {
    s.recipeMap = []
    s.focusedRecipe = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
