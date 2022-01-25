import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import welcome from '@/components/Welcome'
import Users from '@/components/User/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import List from '@/components/goods/List'
import Goods from '@/components/goods/Goods'
import Order from '@/components/order/Order'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/Login'
},
{
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    {
      path: '/welcome',
      component: welcome
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/categories',
      component: Cate
    },
    {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: List
    },
    {
      path: '/goods/add',
      component: Goods
    },
    {
      path: '/orders',
      component: Order
    }
  ]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫 beforeEach
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转过来
  // next 一个函数 表示放行
  //      next() 放行      next('/login') 强制跳转
  if (to.path === '/login') {
    return next()
  }
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
