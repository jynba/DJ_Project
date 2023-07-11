<!--
 * @Descripttion: 地标放大缩小组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-07-10 16:31:38
-->
<template>
  <div>
    <div class="change_box">
      <img src="./magnify.png" />
      <img src="./shrink.png" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { app } from "../main.js";
</script>

<style lang="scss" scoped>
.change_box {
  height: 4rem;
  width: 2rem;
  border-radius: 6px;
  background-color: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
    height: 50%;
  }
}
</style>
