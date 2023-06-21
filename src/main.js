/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-21 11:46:16
 * @FilePath: \DJ_Project\dj-project\src\main.js
 * @Description:
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/styles/reset.css';
import { Button, Form, Field, Tabbar, TabbarItem , Icon, Popup, Search} from 'vant';
// 引入 Vant 的 CSS 文件
import 'vant/lib/index.css';



const app = createApp(App);
app.use(router).use(Button).use(Form).use(Field).use(Tabbar).use(TabbarItem).use(Icon).use(Popup).use(Search);
app.mount('#app');
