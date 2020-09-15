import { apiGet, apiPost } from './api'
import {
  getMatchRecipeSubPath,
  getLabelsSubPath,
  getRecipeDetailsSubPath
} from '@/config'

import {
  debugLabelHierarchy,
  debugExploreMatchedRecipesResponse,
  debugRecipeDetailsMap
} from '@/debug_data'

import axios from 'axios'

import { devConfigIsDebug } from '@/dev_config'

let cancellable = null

async function fetchLabels () {
  const res = await apiGet(getLabelsSubPath)
  if (res.hasError) {
    console.log(`Error: fetchLabels`)
  }

  if (devConfigIsDebug && res.tryReplaceData(debugLabelHierarchy)) {
    console.log(`Use debug`)
  }
  return res
}

async function fetchMatchedRecipes (labels) {
  console.log(JSON.stringify(labels))

  if (cancellable !== null) {
    console.log('Force cancel')
    cancellable()
    cancellable = null
  }
  const res = await apiPost(
    getMatchRecipeSubPath,
    labels,
    false,
    new axios.CancelToken(e => {
      cancellable = e
    })
  )
  cancellable = null

  if (res.hasError) {
    console.log(`Error: fetchMatchedRecipes`)
    if (axios.isCancel(res.data)) {
      console.log('Forced cancelled via token')
      return res
    }
  }

  if (
    devConfigIsDebug &&
    res.tryReplaceData(debugExploreMatchedRecipesResponse)
  ) {
    console.log(`Use debug`)
  }

  
  console.log(res.hasError)
  console.log(JSON.stringify(res.data))

  return res
}

async function fetchRecipeDetails (recipeId) {
  const res = await apiGet(getRecipeDetailsSubPath + recipeId)
  if (res.hasError) {
    console.log(`Error: fetchRecipeDetails`)
  }
  console.log(recipeId);
  if (devConfigIsDebug && recipeId in debugRecipeDetailsMap && res.tryReplaceData(debugRecipeDetailsMap[recipeId])) {
    console.log(`Use debug`)
  }
  return res
}

export default {
  fetchLabels,
  fetchMatchedRecipes,
  fetchRecipeDetails
}
