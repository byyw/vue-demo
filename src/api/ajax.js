import Vue from 'vue'
import axios from "axios";

const baseURL = 'http://192.168.1.77:8081/admin.php'

let http = axios.create();
http.defaults.baseURL = baseURL;

http.cors = (url, params, loading, noErr) => {
    if (loading) {
        Vue.prototype.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 2000
        });
    }
    return http.post(url, params, { loading, noErr });
};

// 添加请求拦截器
http.interceptors.request.use((request) => {
    return request;
});

// 添加响应拦截器
http.interceptors.response.use(
    (response) => {
        // Close loading
        if (response.config.loading) {
            Vue.prototype.$toast.clear(true)
        }
        switch (response.data.code) {
            case 0:
                break;
            case 301:
                // Vue.prototype.$toast.fail("You are logout!")
                break;
            case 2061:
                break;
            default:
                response.data.message === '补货单中没有该商品' && (response.data.message = '新添商品不支持调层，可删除后重新添加')
                !response.config.noErr
                // && Vue.prototype.$toast.fail(response.data.msg || response.data.memo || response.data.message || "网络异常，请稍后再试...");
                break;
        }
        return response.data;
    },
    error => {
        // Vue.prototype.$toast.fail("网络错误")
        Promise.reject(error);
        // 对响应错误做点什么
        return 'Network Error'
    }
);

export default http

