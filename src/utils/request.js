// 进行axios二次封装：使用请求与拦截器
import axios from "axios";
import { ElNotification } from "element-plus";
// 第一步：创建实例
let request = axios.create({
  // 基础路径，发请求时都会携带
  // baseURL: '/api',
  timeout: 20000, //超时时间
});
// 第二步：给实例添加 请求拦截器
request.interceptors.request.use((config) => {
  // 返回配置对象 headers 请求头 给服务器端携带公共参数
  // 如进度条也可做
  return config;
});
//第三步：响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调

    return response.data;
  },
  (error) => {
    let message = "";
    // 处理http网络错误
    let status = error.response?.status;
    if (status)
      switch (status) {
        case 401:
          message = "TOKEN 过期: " + error.response.break;
        case 403:
          message = "无权访问";
          break;
        case 404:
          message = "Not Found";
          break;
        case 500:
          message = "服务器出现错误";
          break;
        default:
          message = "网络出现问题";
          break;
      }
    // 提示错误信息
    // ElMessage({
    // 	type: 'error',
    // 	message,
    // });
    ElNotification({
      message,
      type: "error",
      duration: 1000,
    });
    console.log(error);
    return Promise.reject(error);
  },
);

// 对外暴露
export default request;
