<!--
 * @Descripttion: 搜索组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 20:44:11
 * @LastEditTime: 2023-07-10 18:02:56
-->
<template>
  <div>
    <!-- 默认显示用 -->

    <van-floating-panel
      v-model:height="height"
      :anchors="anchors"
      :content-draggable="false"
      class="jy-panel"
    >
      <van-search
        v-model="searchVal.name"
        @focus="handleSearchFocus"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        class="jy-search"
      >
        <template #left-icon>
          <img src="../assets/AI.png" style="width: 2rem; height: 2rem" />
        </template>
        <template #right-icon>
          <img src="../assets/search.png" style="width: 2rem; height: 2rem" />
        </template>
      </van-search>

      <div class="flex-col relative section_4 space-y-16" ref="chatContainer">
        <span class="self-start text_3">对话记录</span>
        <div
          class="flex-col group_4 space-y-12"
          v-for="item in ConverData.conversations"
        >
          <div class="flex-row justify-end group_5 space-x-5">
            <div class="flex-col justify-cneter items-center text-wrapper_2">
              <span class="text_4">{{ item.q }}</span>
            </div>
            <img
              class="self-start image_3"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/618880640163bf0011e2e0b2/64914e4f54fe0000116a6d3f/16885501565342185854.png"
            />
          </div>
          <div class="flex-row items-center space-x-6">
            <img
              class="image_4"
              src="https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/618880640163bf0011e2e0b2/64914e4f54fe0000116a6d3f/16885501568338949860.png"
            />
            <div class="flex-col justify-center text-wrapper_3">
              <div class="loading-wrapper" v-show="!item.hasloading">
                <span class="loading-text">正在加载中</span>
                <span class="dot-1">.</span>
                <span class="dot-2">.</span>
                <span class="dot-3">.</span>
              </div>
              <span class="font_1 text_5" v-show="item.hasloading">{{
                item.ans
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </van-floating-panel>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import qs from "qs";

import { nextTick } from "vue";
import request from "../utils/request";

const searchVal = { name: "" };
const ConverData = reactive({
  conversations: [],
});

const anchors = [
  125,
  Math.round(0.4 * window.innerHeight),
  Math.round(0.7 * window.innerHeight),
];
const height = ref(anchors[0]);

const chatContainer = ref();
const scrollToBottom = () => {
  nextTick(() => {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  });
};

const handleSearchFocus = () => {
  height.value = anchors[1];
};

const onSearch = () => {
  scrollToBottom();
  console.log(searchVal.name);
  let conversations_item = {
    q: searchVal.name,
    hasloading: false,
  };
  // 填加问题记录
  ConverData.conversations.push(conversations_item);

  request({
    url: "/gpt/exec/",
    method: "post",
    data: qs.stringify({
      ori: conversations_item.q,
    }),
  }).then((res) => {
    conversations_item.hasloading = true;
    console.log(res);
    ConverData.conversations[ConverData.conversations.length - 1].ans =
      res.result;
  });

  if (searchVal.name.length > 0) {
    axios
      .post(IP_ADDRESS_WMS3 + "searchDongjiangList", qs.stringify(searchVal))
      .then((res) => {
        console.log("res", res);
        console.log("res.data.data.length", res.data.data.length);
        if (res.data.data.length == 1) {
          //获取经纬度
          const geom = JSON.parse(res.data.data[0].geom);
          //获取当前高度
          const currentHeight = Math.ceil(
            window.viewer.camera.positionCartographic.height,
          );
          // 移动到对象位置
          const flytoLat = parseFloat(geom[0]);
          const flytoLng = parseFloat(geom[1]);
          //飞到指定高度
          flyToLocationCenter(flytoLat, flytoLng, currentHeight);
        }
      });
  }
  searchVal.name = "";
};

/**
 * @Author: 朱海东
 * @Date: 2023-07-05 15:14:01
 * @name: flyToLocationCenter
 * @msg: 飞到合适的高度
 * @param {*} flytoLat
 * @param {*} flytoLng
 * @param {*} currentHeight
 * @return {*}
 */
const flyToLocationCenter = (flytoLat, flytoLng, currentHeight) => {
  //高于150000根据计算飞行
  if (currentHeight > 15000) {
    // 利用经纬度坐标计算边界起点到中点的距离
    const firstLat = flytoLat + 0.1;
    const firstLng = flytoLng + 0.1;
    const diameter = Math.sqrt(
      Math.pow(firstLat - flytoLat, 2) + Math.pow(firstLng - flytoLng, 2),
    );
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        flytoLat,
        flytoLng,
        diameter * 177770 * 1.5,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0),
      },
    });
  } else {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        flytoLat,
        flytoLng,
        currentHeight,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0),
      },
    });
  }
};
</script>

<style scoped lang="scss">
.loading-wrapper {
  font-size: 0.88rem;
}

@keyframes loading {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.loading-wrapper {
  display: flex;
  align-items: center;
}

.loading-text {
  animation: loading 1.5s infinite;
}

.dot-1,
.dot-2,
.dot-3 {
  animation: loading 1.5s infinite;
  animation-delay: 0.5s;
  opacity: 0.3;
}

.dot-2 {
  animation-delay: 1s;
}

.dot-3 {
  animation-delay: 1.5s;
}

.font_1 {
  font-size: 0.88rem;
  font-family: OPPOSans;
  line-height: 0.84rem;
}
.section_4 {
  padding: 0.75rem 0.63rem 25.13rem;
  background-color: #ffffff;
}

.space-y-16 {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
}

.space-y-16 > *:not(:first-child) {
  margin-top: 1rem;
}
.text_3 {
  color: #1a65fc;
  font-size: 1rem;
  font-family: OPPOSans;
  line-height: 0.94rem;
}
.group_4 {
  padding-left: 0.13rem;
}
.space-y-12 > *:not(:first-child) {
  margin-top: 0.75rem;
}
.group_5 {
  padding-left: 3.5rem;
}
.space-x-5 > *:not(:first-child) {
  margin-left: 0.31rem;
}
.text-wrapper_2 {
  word-wrap: normal;
  word-break: break-all;
  max-width: 80%;
  border-radius: 10px;
  padding: 0.4rem;
  background-color: #cdf4f9;
  justify-content: center;
}
.text_4 {
  color: #000000;
  font-size: 0.88rem;
  font-family: OPPOSans;
  line-height: 1.06rem;
  width: 100%;
}
.image_3 {
  border-radius: 0.13rem;
  width: 2.25rem;
  height: 2.25rem;
}
.space-x-6 > *:not(:first-child) {
  margin-left: 0.38rem;
}
.image_4 {
  width: 2rem;
  height: 1.81rem;
}
.text-wrapper_3 {
  padding: 0.4rem;
  word-wrap: normal;
  word-break: break-all;
  max-width: 80%;
  border-radius: 10px;
  background-color: #f5f5f5;
}
.text_5 {
  color: #000000;
  font-size: 0.88rem;
  font-family: OPPOSans;
  line-height: 1.06rem;
  width: 100%;
}
</style>
