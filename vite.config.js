/*
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: GRIT
 * @LastEditTime: 2023-05-15 19:39:54
 * @FilePath: \DJ_Project\dj-project\vite.config.js
 * @Description: 
 */
import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),cesium()],
})
