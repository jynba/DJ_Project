<!--
 * @Descripttion: 搜索组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 20:44:11
 * @LastEditTime: 2023-06-21 16:18:11
-->
<template>
    <div>

     <!-- 默认显示用 -->
    <van-search  placeholder="请输入搜索关键词" @search="onSearch"/>
    <!-- 弹出后 -->
    <van-popup round v-model:show="popupShow" position="bottom" :style="{ height: '100%' }">
      <van-search  placeholder="请输入搜索关键词" v-model:value="searchValue" show-action @search="onSearch" />
    </van-popup>
    <!-- <van-popup v-model:show="show">内容</van-popup> -->
  </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const popupShow = ref(false);
  const searchShow = ref(false);
  const searchValue = ref('');
  
  function onSearch() {
    // 这里是搜索逻辑的处理
    searchShow.value = false;
  }


  </script>
