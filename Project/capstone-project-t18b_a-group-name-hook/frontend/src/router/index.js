import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/views/HomePage'
// import LoginPage from '@/views/LoginPage'
// import ProfilePage from '@/views/ProfilePage'
// import ExploreHomePage from '@/views/ExploreHomePage'
// import ExploreRecipeDetailsPage from '@/views/ExploreRecipeDetailsPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: HomePage,
    meta: {
      title: 'MealMatch - Welcome'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    // component: ProfilePage,
    component: () => import('../views/ProfilePage.vue'),
    meta: {
      title: 'MealMatch - Profile'
    }
  },
  {
    path: '/explore',
    name: 'ExploreMain',
    component: () => import('../views/ExploreHomePage.vue'),
    meta: {
      title: 'MealMatch - Explore'
    }
  },
  {
    path: '/explore/:recipe_id',
    name: 'ExploreRecipeDetails',
    component: () => import('../views/ExploreRecipeDetailsPage.vue'),
    meta: {
      title: 'MealMatch - Explore'
    }
  },

  {
    path: '/contribute',
    name: 'ContributeMain',
    component: () => import('../views/ContributionHomePage.vue'),
    // component: ContributionHomePage,
    meta: {
      title: 'MealMatch - Create'
    }
  },
  {
    path: '/contribute/:recipe_id',
    name: 'ContributeRecipeDetails',
    component: () => import('../views/ContributionRecipeDetailPage.vue'),
    meta: {
      title: 'MealMatch - Create'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage'),
    meta: {
      title: 'MealMatch - Login'
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('../views/Logout.vue'),
    meta: {
      title: 'MealMatch - Logging out'
    }
  },
  { path: '*', component: () => import('../views/RedirectPage.vue') }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router
