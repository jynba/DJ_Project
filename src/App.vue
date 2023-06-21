<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 15:38:35
 * @LastEditTime: 2023-06-21 16:56:06
-->
<template>
	<div id="app">
		<!-- 只有 name 为 home 的页面会被缓存 -->
		<keep-alive include="home">
			<router-view/>
		</keep-alive>
		<van-tabbar v-model="active.selected">
			<van-tabbar-item icon="home-o" :to="{ name: 'home' }" active>
				首页
			</van-tabbar-item>
			<van-tabbar-item icon="location-o" :to="{ name: 'near' }">
				附近
			</van-tabbar-item>
			<van-tabbar-item icon="manager-o" :to="{ name: 'user' }">
				我的
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script setup>
// export default {
// 	name: 'App',
// };
import { reactive,onMounted} from 'vue'
//默认选中首页
const active = reactive({
	selected: 0
})



</script>

<style lang="scss">
html,
body,
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	padding: 0px;
	margin: 0px;
	@include bfc;
}
</style>
