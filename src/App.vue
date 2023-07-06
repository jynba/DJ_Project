<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 15:38:35
 * @LastEditTime: 2023-07-06 09:47:43
-->
<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <van-tabbar class="tabbar" v-model="active.selected">
      <van-tabbar-item icon="home-o" :to="{ name: 'home' }" :class="{ active: currentRouteName === 'home' }">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="location-o" :to="{ name: 'near' }" :class="{ active: currentRouteName === 'near' }">
        附近
      </van-tabbar-item>
      <van-tabbar-item icon="manager-o" :to="{ name: 'user' }" :class="{ active: currentRouteName === 'user' }">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
// export default {
// 	name: 'App',
// };
import { reactive, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const active = reactive({
  selected: 0,
});

const router = useRouter();
const currentRouteName = ref("");
onMounted(() => {
  console.log("router", router.currentRoute.value.name);
});

//监听导航栏  让图标颜色跟随变化
watch(
  () => router.currentRoute.value.name,
  (name) => {
	
    currentRouteName.value = name;
  },
);
</script>

<style lang="scss">
html,
body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0px;
  margin: 0px;
  @include bfc;
  .tabbar {
    z-index: 2000;
  }
  .active {
    color: #1989fa;;
  }
//   .van-tabbar-item--active{
// 	color: black;
//   }
}
</style>
