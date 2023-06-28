<!--
 * @Descripttion: 搜索组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 20:44:11
 * @LastEditTime: 2023-06-27 15:45:12
-->
<template>
  <div>

    <!-- 默认显示用 -->

    <van-floating-panel v-model:height="height" :anchors="anchors" :content-draggable="false">
      <van-search @focus="handleSearchFocus" placeholder="请输入搜索关键词" @search="onSearch">
        <template #left-icon>
          <img src="../assets/AI.png" style="width: 2rem; height: 2rem;" />
        </template>
        <template #right-icon>
          <img src="../assets/search.png" style="width: 2rem; height: 2rem;" />
        </template>
      </van-search>
    </van-floating-panel>

  </div>
</template>
  
<script setup>
import { ref } from 'vue';


const anchors = [
  125,
  Math.round(0.4 * window.innerHeight),
  Math.round(0.7 * window.innerHeight),
];
const height = ref(anchors[0]);

const handleSearchFocus = () => {
  height.value = anchors[2]
}

</script>

<style scoped></style>

