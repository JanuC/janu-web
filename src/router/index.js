import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/home/home'
import Index from '@/components/index/index'
import Blog from '@/components/blog/blog'
import Music from '@/components/music/music'
import Setting from '@/components/setting/setting'

Vue.use(Router)

export default new Router({
  routes: [
    // 重定向
    {path: '/', redirect: '/home'},
    {path: '/home', redirect: '/home/index'},
    {path: '/home',component: Home,
      children: [
        {path: '/home/index',component: Index},
        {path: '/home/blog',component: Blog},
        {path: '/home/music',component: Music},
        {path: '/home/setting',component: Setting},
      ]
    }
  ]
})
