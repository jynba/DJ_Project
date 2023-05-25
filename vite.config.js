/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: GRIT
 * @LastEditTime: 2023-05-21 14:45:09
 * @FilePath: \DJ_Project\dj-project\vite.config.js
 * @Description:
 */
import { defineConfig, loadEnv } from 'vite';
import cesium from 'vite-plugin-cesium';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
	plugins: [vue(), cesium()],
	base: './',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/bem.scss";`,
			},
		},
	},
	build: {
		outDir: 'dist',
	},
	define: {
		// geoserver服务地址
		IP_ADDRESS_WMS1: JSON.stringify('http://172.27.101.19:8080/'),
		IP_ADDRESS_WMS: JSON.stringify('https://eslab2.dgut.edu.cn/'),
	},
}));
