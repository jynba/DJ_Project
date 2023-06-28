/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-27 17:51:41
 * @FilePath: \DJ_Project\dj-project\src\main.js
 * @Description:
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import qs from 'qs';
import '@/styles/reset.css';
import { Icon,Button, Form, Field, Tabbar, TabbarItem ,Popup, Search,FloatingPanel} from 'vant';
// 引入 Vant 的 CSS 文件
import 'vant/lib/index.css';



const app = createApp(App);
app.use(router)
app.use(FloatingPanel).use(Button).use(Form).use(Field).use(Tabbar).use(TabbarItem).use(Icon).use(Popup).use(Search);
app.mount('#app');
