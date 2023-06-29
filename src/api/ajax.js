import axios from "axios";

// dev
// const baseURL ={
//     "php": 'http://192.168.1.77:8081',
//     "java": 'http://192.168.1.77:8083'
// }

// test
const baseURL ={
    "php": 'http://chechuan.hzfjzn.com',
    "java": 'http://47.94.95.112:8083'
}

let http = axios.create();
http.defaults.baseURL = baseURL;

http.cors = (server ,url, params) => {
    if(server == undefined || baseURL[server]==null)
        return http.post(url, params);
    return http.post(baseURL[server]+url, params);
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

