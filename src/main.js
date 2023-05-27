/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: GRIT
 * @LastEditTime: 2023-05-15 19:51:36
 * @FilePath: \DJ_Project\dj-project\src\main.js
 * @Description:
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/styles/reset.css';
const app = createApp(App);
app.use(router);

app.mount('#app');
