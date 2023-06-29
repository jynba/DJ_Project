<!--
 * @Descripttion: 地标建筑详情组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-06-29 18:01:20
-->
<template>
  <div>
    <van-popup
      v-model:show="popupShow"
      closeable
      round
      :overlay="false"
      position="bottom"
      :style="{ height: '30%' }"
      >内容</van-popup
    >
  </div>
</template>

<script setup>
import { app } from "../main.js";
import { ref } from "vue";

const popupShow = ref(true);
</script>

<style scoped></style>
