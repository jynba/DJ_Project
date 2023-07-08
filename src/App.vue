<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 15:38:35
 * @LastEditTime: 2023-07-07 10:52:07
-->
<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <van-tabbar class="tabbar" v-model="active.selected">
      <van-tabbar-item
        active
        icon="home-o"
        :to="{ name: 'home' }"
        v-model="active.selected"
      >
        首页
      </van-tabbar-item>
      <van-tabbar-item
        icon="location-o"
        :to="{ name: 'near' }"
        v-model="active.selected"
      >
        附近
      </van-tabbar-item>
      <van-tabbar-item
        icon="manager-o"
        :to="{ name: 'user' }"
        v-model="active.selected"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
// export default {
// 	name: 'App',
// };
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const init = () => {
  return new Promise((resolve, reject) => {
    // 如果已加载直接返回
    if (window.T) {
      console.log("地图脚本初始化成功...");
      resolve(window.T);
      reject("error");
    }
  });
};

const active = reactive({
  selected: 0,
});

//监听导航栏  让图标颜色跟随变化
const route = useRoute();
const router = useRouter();

// 监听路由变化
watch(
  () => route.name,
  (name) => {
    // 根据路由名称设置选中项
    switch (name) {
      case "home":
        active.selected = 0;
        break;
      case "near":
        active.selected = 1;
        break;
      case "user":
        active.selected = 2;
        break;
      default:
        active.selected = 0;
        break;
    }
  }
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
    color: #1989fa;
  }
  .van-tabbar-item--active {
    color: #1989fa;
  }
}
</style>
