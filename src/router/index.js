import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Home',
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/Home.vue')
  },

  {
    path: '/Resource',
    name: 'Resource',
    component: () => import(/* webpackChunkName: "resource" */ '@/views/resource/Resource.vue')
  },
  {
    path: '/Playing',
    name: 'Playing',
    component: () => import(/* webpackChunkName: "playing" */ '@/views/playing/Playing.vue')
  },
  {
    path: '/Producer',
    name: 'Producer',
    component: () => import(/* webpackChunkName: "producer" */ '@/views/producer/Producer.vue')
  },

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '@/views/about/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
