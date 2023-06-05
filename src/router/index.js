import Vue from 'vue'
import VueRouter from 'vue-router';

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

export const constantRoutes = [
    {
        path: '/',
        component: () => import('@/components/DeviceTypeList.vue'), 
        meta: { title: '首页' }
    },
    {
        path: '/device_type_list',
        component: () => import('@/components/DeviceTypeList.vue'),
        meta: { title: '设备类型列表' },
        children: [
            {
                path: 'device_type_item',
                component: () => import('@/components/DeviceTypeItem.vue'),
                meta: { title: '设备类型' }
            },
        ]
    },
    {
        path: '/device_list',
        component: () => import('@/components/DeviceList.vue'),
        meta: { title: '设备对象列表' }
    },
    {
        path: '/interface_test',
        component: () => import('@/components/InterfaceTest.vue'),
        meta: { title: '接口测试' },
        children: [
        ]
    },
]
export default new VueRouter({
    routes: constantRoutes
});