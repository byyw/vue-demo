import Vue from 'vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const constantRoutes = [
    {
        path: '/index',
        component: () => import('@/components/HelloWorld.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/DeviceTypeList',
        component: () => import('@/components/DeviceTypeList.vue'),
        meta: { title: '设备类型列表' },
        children: [
            {
                path: 'DeviceType',
                component: () => import('@/components/DeviceType.vue'),
                meta: { title: '设备类型' }
            },
        ]
    },
]
export default new VueRouter({
    routes: constantRoutes
});