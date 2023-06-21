/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-20 18:26:34
 * @FilePath: \DJ_Project\dj-project\src\main.js
 * @Description:
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@/styles/reset.css';
import { Button, Form, Field, Tabbar, TabbarItem , Icon} from 'vant';
// 引入 Vant 的 CSS 文件
import 'vant/lib/index.css';

// import 'vant/lib/vant.css'

const app = createApp(App);
app.use(router);
app.use(Button);
app.use(Form);
app.use(Field);
app.use(Tabbar);
app.use(TabbarItem);
app.use(Icon);
app.mount('#app');
