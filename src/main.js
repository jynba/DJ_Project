/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-01 16:05:33
 * @FilePath: \DJ_Project\dj-project\src\main.js
 * @Description:
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import mitt from 'mitt';
import qs from 'qs';
import '@/styles/reset.css';
import '@/styles/codefun.css';
import '@/styles/diyvant.css';
import { Cell, CellGroup, Icon, Button, Form, Field, Tabbar, TabbarItem, Popup, Search, FloatingPanel, Col, Row, NoticeBar } from 'vant';
import { Image as VanImage } from 'vant';

// 引入 Vant 的 CSS 文件
import 'vant/lib/index.css';


const app = createApp(App);
// 创建一个事件总线
const eventBus = mitt();
app.config.globalProperties.$eventBus = eventBus;
app.use(router)
app.use(FloatingPanel).use(Button).use(Form).use(Field).use(Tabbar).use(TabbarItem).use(Icon).use(Popup).use(Search).use(Cell).use(CellGroup).use(Col).use(Row).use(VanImage).use(NoticeBar);
app.mount('#app');

export { app, eventBus };
