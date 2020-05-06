import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import ArticlesByCategory from '@/components/article/ArticlesByCategory'
import ArticleById from '@/components/article/ArticleById'
import Auth from '@/components/auth/Auth'

import { userKey, baseApiUrl } from '@/global'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
    meta: { requiresAdmin: true }
  },
  {
    name: 'articlesByCategory',
    path: '/categories/:id/articles',
    component: ArticlesByCategory
  },
  {
    name: 'ArticleById',
    path: '/articles/:id',
    component: ArticleById
  },
  {
    name: 'auth',
    path: '/auth',
    component: Auth
  }
]

const router =  new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const json = localStorage.getItem(userKey)

  async function validateAdmin() {
    const user = JSON.parse(json)
    if(user) {
      const res = await axios.post(`${baseApiUrl}/validateAdmin`, user)
      if(res.data){
        next()
      } else {
        next({path: '/'})
      }
    }
  }

  if(to.matched.some(record => record.meta.requiresAdmin)) {
    validateAdmin()
  } else {
    next()
  }
})

export default router