import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/home/home'
import Index from '@/components/index/index'
import Blog from '@/components/blog/blog'
import Music from '@/components/music/music'
import Setting from '@/components/setting/setting'
import Recommend from '@/components/music/recommend'
import Rank from '@/components/music/rank'
import List from '@/components/music/list'
import Search from '@/components/music/search'

Vue.use(Router)

export default new Router({
  routes: [
    // 重定向
    {path: '/', redirect: '/home'},
    {path: '/home', redirect: '/home/index'},
    {path: '/home/music',redirect: '/home/music/recommend'},
    {path: '/home',component: Home,
      children: [
        {path: '/home/index',component: Index},
        {path: '/home/blog',component: Blog},
        {path: '/home/music',component: Music,
        children: [
          {path: '/home/music/recommend',component: Recommend},
          {path: '/home/music/rank',component: Rank},
          {path: '/home/music/list',component: List},
          {path: '/home/music/search',component: Search}
        ],
        
        },
        {path: '/home/setting',component: Setting},
      ]
    }
  ]
})
