<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 17:42:35
 * @LastEditTime: 2023-07-07 17:19:42
-->
<template>
    <div class="my-page">
        <van-image src="./userback.png" fit="cover" />
      <div class="user-info">
        <img class="avatar" :src="state.avatarUrl" >
        <div class="username">{{ state.username }}</div>
      </div>
  
      <van-cell-group>
        <van-cell
          v-for="(item, index) in state.menuItems"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          arrow-direction="right"
          @click="handleItemClick(item)"
        />
      </van-cell-group>
    </div>
  </template>
  
  <script setup>
  import { reactive } from "vue";
  
  const state = reactive({
    avatarUrl: "./user.jpg",
    username: "jacklove",
    menuItems: [
      {
        title: "我的标记",
        icon: "star-o",
        action: "myBookmarks",
      },
      {
        title: "意见反馈",
        icon: "chat-o",
        action: "feedback",
      },
      {
        title: "账号管理",
        icon: "setting-o",
        action: "accountManagement",
      },
      {
        title: "关于我们",
        icon: "info-o",
        action: "aboutUs",
      },
    ],
  });
  
  const handleItemClick = (item) => {
    switch (item.action) {
      case "myBookmarks":
        // 处理我的标记的点击事件
        break;
      case "feedback":
        // 处理意见反馈的点击事件
        break;
      case "accountManagement":
        // 处理账号管理的点击事件
        break;
      case "aboutUs":
        // 处理关于我们的点击事件
        break;
      default:
        break;
    }
  };
  </script>
  
  <style>
  .my-page {
    padding: 1rem;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;
    .avatar {
    width: 3rem;
    height:3rem;
    border-radius: 50%;
    margin-right: 0.8rem;
  }
  
  .username {
    font-size: 1rem;
  }
  }
  

  
  .van-cell {
    margin-bottom: 0.5rem;
  }
  </style>