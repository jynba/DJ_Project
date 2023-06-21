/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 15:38:35
 * @LastEditTime: 2023-06-20 18:50:51
 */
import { createRouter, createWebHashHistory } from 'vue-router';
const Home = () => import('@/views/main.vue')
const News = () => import('@/views/news.vue')
const User = () => import('@/views/user.vue')




const routes = [
	{
	  path: '/',
	  name: 'home',
	  meta: {
		title: '首页',
	  },
	  component: Home
	},
	{
	  path: '/news',
	  name: 'news',
	  meta: {
		title: '消息'
	  },
	  component: News
	},
	{
	  path: '/user',
	  name: 'user',
	  meta: {
		title: '我的'
	  },
	  component: User
	}
  ]
  

const router = createRouter({
	history: createWebHashHistory(),
	routes: routes,
});

export default router;
