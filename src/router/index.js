import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		meta: {
			title: '智慧东江',
		},
		component: () => import('@/views/main.vue'),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes: routes,
});

export default router;
