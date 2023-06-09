/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-06 09:14:16
 * @FilePath: \DJ_Project\dj-project\vite.config.js
 * @Description:
 */
import { defineConfig, loadEnv } from 'vite';
import cesium from 'vite-plugin-cesium';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
	plugins: [
		vue(),
		cesium(),
		// 自动导入element ui
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	base: './',
	// 路径配置
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	// 服务器代理
	server: {
		proxy: {
			'/api': {
				target: 'https://eslab.dgut.edu.cn/',
				// target: loadEnv(mode, process.cwd()).VITE_TESTSERVER, // 接口的域名
				// 若loadENV无第三个参数''，则需要VITE_前缀
				secure: true, // 如果是https接口，需要配置这个参数
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
				rewrite: (path) => path.replace(/^\/api/, ''),
				//重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`
				//注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的
			},
			'/gpt': {
				target: 'http://106.55.180.180:8077/',
				// target: loadEnv(mode, process.cwd()).VITE_TESTSERVER, // 接口的域名
				// 若loadENV无第三个参数''，则需要VITE_前缀
				secure: false, // 如果是https接口，需要配置这个参数
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
				rewrite: (path) => path.replace(/^\/gpt/, ''),
			},
		},
	},
	// css预处理器
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/bem.scss";`,
			},
		},
	},
	// 打包路径
	build: {
		outDir: 'dist',
	},
	// 环境变量
	define: {
		// geoserver服务地址

		IP_ADDRESS_WMS1: JSON.stringify('http://172.27.101.19:8080/'),
		IP_ADDRESS_WMS2: JSON.stringify('http://172.27.101.19:8090/'),
		IP_ADDRESS_WMS3: JSON.stringify('https://eslab.dgut.edu.cn/'),
		IP_ADDRESS_WMS: JSON.stringify('https://eslab2.dgut.edu.cn/'),

	},
}));
