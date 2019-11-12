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
import Login from '@/components/back/login'
import BackHome from '@/components/back/backhome'
import Article from '@/components/back/article'
import Write from '@/components/back/write'
import ArticleMain from '@/components/blog/article'
Vue.use(Router)

import axios from 'axios'

const address = 'http://v1.janulog.com:3001';

const router = new Router({
  mode: 'history',
  routes: [
    // 重定向
    {path: '/', redirect: '/home'},
    {path: '/home', redirect: '/home/index'},
    {path: '/home/music',redirect: '/home/music/recommend'},
    {path: '/home',component: Home,
      children: [
        {path: '/home/index',component: Index},
        {path: '/home/blog',component: Blog},
        {path: '/home/artcile',component: ArticleMain},
        {path: '/home/music',component: Music,
        children: [
          {path: '/home/music/recommend',component: Recommend},
          {path: '/home/music/rank',component: Rank},
          {path: '/home/music/list',name:'home/music/list',component: List},
          {path: '/home/music/search',component: Search}
        ],
        
        },
        {path: '/home/setting',component: Setting},
      ]
    },
    {path: '/back',redirect: '/back/login'},
    {path: '/back/login',component: Login},
    {path: '/back/backhome',component: BackHome,redirect: '/back/backhome/article',
    children:[
      {path: '/back/backhome/article',component: Article},
      {path: '/back/backhome/write',component: Write},
    ]},
  ],
  
})

router.beforeEach((to, from, next) => {
  if(to.path =='/back/backhome/write' || to.path =='/back/backhome/article' ) {
     // 判断身份是否合法
    // 先判断localStorage中是否有 username 和 token
    let username = localStorage.getItem('username')
    let token = localStorage.getItem('token')
    if(!username || !token) {
      // 用户身份不合法
      next('/back/login')
    }else {
      // 发请求看localStorage 和  服务器端是否匹配
      axios
        .post(address + '/api/checkuser',{username: username,token: token})
        .then(res => {
          if(res.data.status) {
            next()
          }else {
            next('/back/login')
          }
          
        })
    }
    
  }else {
    next()
  }
  // }else if(to.path == '/home/:name') {
  //   next()
  // }else {
  //   console.log(1);
    
  // }
})

// router.beforeEach((to, from, next) => {
//   if(to.path == '/back' || to.path =='/back')
//   if(to.path == '/home/*' || to.path == '/back/login' || to.path == '/back') {
//     next()
//   }else {
//     // 判断身份是否合法
//     // 先判断localStorage中是否有 username 和 token
//     let username = localStorage.getItem('username')
//     let token = localStorage.getItem('token')
//     if(!username || !token) {
//       // 用户身份不合法
//       next('/back/login')
//     }else {
//       // 发请求看localStorage 和  服务器端是否匹配
//       axios
//         .post(address + '/api/checkuser',{username: username,token: token})
//         .then(res => {
//           if(res.data.status) {
//             next()
//           }else {
//             next('/back/login')
//           }
          
//         })
//     }

//   }
  
// })

export default router
