import Vue from 'vue'
import VueRouter from 'vue-router';

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

export const constantRoutes = [
    {
        path: '/index',
        component: () => import('@/pages/DeviceList/deviceList.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/deviceList123',
        component: () => import('@/pages/DeviceList/deviceList.vue'),
        meta: { title: '设备对象列表2' },
        children: [
            {
                path:"DeviceItem",
                component: () => import('@/components/DeviceItem.vue'),
                meta: { title: '设备' }
            },{
                path:"GpsDataList",
                component: () => import('@/components/data/GpsDataList.vue'),
                meta: { title: '定位数据' }
            },{
                path:"GpsVideoList",
                component: () => import('@/components/data/GpsVideoList.vue'),
                meta: { title: '定位视频' }
            }
        ]
    },

    {
        path: '/DeviceTypeList',
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
        meta: { title: '接口测试' }
    },
]
export default new VueRouter({
    mode: "hash",
    routes: constantRoutes
});
