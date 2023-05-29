import axios from "axios";

const baseURL = 'http://192.168.1.77:8081'

let http = axios.create();
http.defaults.baseURL = baseURL;

http.cors = (url, params) => {
    return http.post(url, params);
};

// 添加请求拦截器
http.interceptors.request.use((request) => {
    // request.headers['Access-Control-Request-Headers'] = 'content-type';
    return request;
});

// 添加响应拦截器
http.interceptors.response.use(
    (response) => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    }
);

export default http

