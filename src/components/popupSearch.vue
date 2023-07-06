<!--
 * @Descripttion: 搜索组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 20:44:11
 * @LastEditTime: 2023-07-06 09:15:00
-->
<template>
  <div>
    <!-- 默认显示用 -->

    <van-floating-panel
      v-model:height="height"
      :anchors="anchors"
      :content-draggable="false"
    >
      <van-search
        v-model="searchVal.name"
        @focus="handleSearchFocus"
        placeholder="请输入搜索关键词"
        @search="onSearch"
      >
        <template #left-icon>
          <img src="../assets/AI.png" style="width: 2rem; height: 2rem" />
        </template>
        <template #right-icon>
          <img src="../assets/search.png" style="width: 2rem; height: 2rem" />
        </template>
      </van-search>
    </van-floating-panel>

  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import qs from "qs";

const searchVal = { name: "" };

const anchors = [
  125,
  Math.round(0.4 * window.innerHeight),
  Math.round(0.7 * window.innerHeight),
];
const height = ref(anchors[0]);

const handleSearchFocus = () => {
  height.value = anchors[1];
};

const onSearch = () => {
  console.log(searchVal.name);
  if (searchVal.name.length > 0) {
    axios
      .post(IP_ADDRESS_WMS3 + "searchDongjiangList", qs.stringify(searchVal))
      .then((res) => {
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
  searchVal.name=''
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

<style scoped></style>
