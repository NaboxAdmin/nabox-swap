import Vue from 'vue'
import VueRouter from 'vue-router'
import { BasicLayout, LoginLayout } from "../layout";
Vue.use(VueRouter);

const mainRoutes = [{
    path:'/',
    name:'index',
    redirect: '/swap',
    component: BasicLayout,
    meta: {
      keepAlive: true
    },
    children:[
        // {
        //     path:'/index',
        //     name:'index',
        //     component:() => import('../views/index/index'),
        //     meta: {
        //         title:'首页'
        //     }
        // },
        {
            path:'/swap',
            name:'swap',
            component:() => import('../views/Swap'),
            meta: {
                title:'Swap',
                // keepAlive: true
            }
        },
        {
            path:'/transfer',
            name:'transfer',
            component:() => import('../views/Transfer'),
            meta: {
                title:'Transfer'
            }
        },
        {
            path:'/liquidity',
            name:'liquidity',
            component:() => import('../views/Pool'),
            meta: {
                title:'Pool'
            }
        },
        {
            path:'/vaults',
            name:'vaults',
            component:() => import('../views/Vaults'),
            meta: {
                title:'Vaults'
            }
        },
        {
            path:'/airdrop',
            name:'airdrop',
            component:() => import('../views/airdrop'),
            meta: {
                title:'Airdrop'
            }
        }
    ]
}, {
    path:'/',
    name:'basic',
    redirect: '/confirmOrder',
    component: LoginLayout,
    children:[
        {
            path:'/confirmOrder',
            name:'confirmOrder',
            component:() => import('../views/confirmOrder/confirmOrder'),
            meta: {
                title: 'Confirm Order'
            }
        },
        {
            path:'/orderDetail',
            name:'orderDetail',
            component:() => import('../views/orderDetail/orderDetail'),
            meta: {
                title: 'Tx Detail'
            }
        }
    ]
}, {
    path:'*',
    redirect: '/404',
}];

const router = new VueRouter({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    base: process.env.BASE_URL,
    routes: [...mainRoutes]
});

export default router;
