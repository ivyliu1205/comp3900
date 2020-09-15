import router from '@/router'

// initial state
const state = () => ({
  currentRoute: null,
  
})

// getters
const getters = {
  mainRoutes (s, g, rs) {
    const res = [
      {
        name: 'Explore',
        link: '/explore',
        icon: 'mdi-file-find'
      },
      {
        name: 'Contribute',
        link: '/contribute',
        icon: 'mdi-creation'
      }
    ]

    if (rs.profile.isLogin) {
      res.push({
        name: 'Profile',
        link: '/profile',
        icon: 'mdi-account'
      })
      res.push({
        name: 'Logout',
        link: '/logout',
        icon: 'mdi-logout'
      })
    } else {
      res.push({
        name: 'Login',
        link: '/login',
        icon: 'mdi-login-variant'
      })
    }

    return res
  },

  currentNavLinkSelectedIndex (s) {
    if (s.currentRoute === null) {
      return -1
    }
    const path = s.currentRoute.path
    if (path.includes('explore')) {
      return 0
    } else if (path.includes('contribute')) {
      return 1
    } else if (path.includes('profile')) {
      return 2
    }
    return -1
  },

  routeSubTitle (s) {
    if (s.currentRoute === null) return ''
    const path = s.currentRoute.path.split('/')[1]
    return path
  },

  appBarFooterVisible (s) {
    return s.currentRoute !== null && s.currentRoute.name !== 'Welcome'
  }
}

// actions
const actions = {
  replace (_, path) {
    console.log(router.currentRoute.path.replace(/\/$/, "").toLowerCase());
    console.log(path.replace(/\/$/, "").toLowerCase());
    if (router.currentRoute.path.replace(/\/$/, "").toLowerCase() == path.replace(/\/$/, "").toLowerCase()) {
      return
    }

    router.replace(path)
  },

  back (_, backupPath) {
    if (window.history.length <= 2 && !backupPath) {
      return false
    }
    if (window.history.length <= 2) {
      router.replace(backupPath)
    } else {
      router.go(-1)
    }
    return true
  },

  to (_, path) {
    console.log(router.currentRoute.path.replace(/\/$/, "").toLowerCase());
    console.log(path.replace(/\/$/, "").toLowerCase());
    if (router.currentRoute.path.replace(/\/$/, "").toLowerCase() == path.replace(/\/$/, "").toLowerCase()) {
      return
    }
    router.push(path)
  },
  handleIncorrectURL({commit, dispatch}) {
    dispatch('replace', '/')
    commit("setMsg", {
      type:"error",
      content: "Page not found. You have been redirected to the main page"
    },
    {root:true})
  },
  toExplore ({ dispatch }) {
    dispatch('to', '/explore')
  },
  toContribute ({ dispatch }) {
    dispatch('to', '/contribute')
  },

  toExploreRecipeDetails ({ dispatch }, recipeId) {
    dispatch('to', '/explore/' + recipeId)
  },
  toContributionRecipeDetails ({ state, dispatch }, recipeId) {
    if(state.currentRoute.name === "ContributeRecipeDetails") {
      dispatch('replace', '/contribute/' + recipeId)
    }
    dispatch('to', '/contribute/' + recipeId)
  },
  toLogin ({ dispatch }) {
    dispatch('to', '/login/')
  },

  toProfile ({ dispatch }) {
    dispatch('to', '/profile/')
  }
}

// mutations
const mutations = {
  updateRoute (s, route) {
    s.currentRoute = route
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
