<!--
 * @Descripttion: 地标放大缩小组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-07-12 09:07:45
-->
<template>
  <div>
    <div class="change_box">
      <img @click="enlarge" src="../assets/magnify.png" />
      <div class="separator"></div>
      <img @click="narrow" src="../assets/shrink.png" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { app } from "../main.js";

/**
 * 功能：飞行到某一个高度
 * @param {*} lon 经度
 * @param {*} lat 纬度
 * @param {*} flyheight 飞行高度
 */
// 定义了一个名为 flyTo 的函数，它接受三个参数：经度 lon，纬度 lat，以及飞行高度 flyheight。
function flyTo(lon, lat, flyheight) {
  // 通过 viewer.camera.flyTo 方法，将摄像机移动到指定的地理位置（经纬度，高度）。
  viewer.camera.flyTo({
    // 使用 Cesium.Cartesian3.fromDegrees 将经纬度转换为三维空间坐标，并作为目标位置。
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, flyheight),
    // 飞行的持续时间为 2 秒。
    duration: 2,
  });
}

/**
 * 函数名：enlarge
 * 创建时间：2023/02/14
 * 作者：梁展图
 * 功能：放大图标按钮的功能，视角移动到下一层
 */
function enlarge() {
  // 定义实际点击放大图标时要飞行的高度
  let controlHeight = [0, 680001, 600001, 350001, 200001, 100001, 30001, 5000];
  // 从中心点获取相机位置
  let centerAllResult = viewer.camera.pickEllipsoid(
    new Cesium.Cartesian2(
      viewer.canvas.clientWidth / 2,
      viewer.canvas.clientHeight / 2,
    ),
  );
  // 获取相机的中心经纬度
  let curPosition =
    Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerAllResult);
  let centerlongitude = (curPosition.longitude * 180) / Math.PI;
  let centerlatitude = (curPosition.latitude * 180) / Math.PI;
  // 获取相机的实际高度
  var realheight = Math.ceil(viewer.camera.positionCartographic.height);
  // 根据相机高度进行不同的飞行操作
  if (realheight > 680001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[1]);
  } else if (realheight <= 680001 && realheight > 600001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[2]);
  } else if (realheight <= 600001 && realheight > 350001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[3]);
  } else if (realheight <= 350001 && realheight > 200001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[4]);
  } else if (realheight <= 200001 && realheight > 100001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[5]);
  } else if (realheight <= 100001 && realheight > 30001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[6]);
  } else if (realheight <= 30001 && realheight > 5001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[7]);
  } else if (realheight <= 5001) {
    flyTo(centerlongitude, centerlatitude, controlHeight[8]);
  }
}

/**
 * 函数名：narrow
 * 创建时间：2023/02/14
 * 作者：梁展图
 * 功能：缩放图标按钮的功能，视角移动到上一层
 */
function narrow() {
  // 定义实际点击缩放图标时要飞行的高度
  let controlHeight = [
    12027664, 7980832, 3757000, 1398373, 576625, 347833, 212048, 100737, 23516,
    5000,
  ];
  // 从中心点获取相机位置
  let centerAllResult = viewer.camera.pickEllipsoid(
    new Cesium.Cartesian2(
      viewer.canvas.clientWidth / 2,
      viewer.canvas.clientHeight / 2,
    ),
  );
  // 获取相机的中心经纬度
  let curPosition =
    Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerAllResult);
  let centerlongitude = (curPosition.longitude * 180) / Math.PI;
  let centerlatitude = (curPosition.latitude * 180) / Math.PI;
  // 获取相机的实际高度
  var realheight = Math.ceil(viewer.camera.positionCartographic.height);
  // 根据相机高度进行不同的飞行操作
  if (realheight > 9927664) {
    flyTo(centerlongitude, centerlatitude, controlHeight[0]);
  } else if (realheight <= 9927664 && realheight > 6034000) {
    flyTo(centerlongitude, centerlatitude, controlHeight[0]);
  } else if (realheight <= 6034000 && realheight > 1480000) {
    flyTo(centerlongitude, centerlatitude, controlHeight[1]);
  } else if (realheight <= 1480000 && realheight > 716747) {
    flyTo(centerlongitude, centerlatitude, controlHeight[2]);
  } else if (realheight <= 716747 && realheight > 436504) {
    flyTo(centerlongitude, centerlatitude, controlHeight[3]);
  } else if (realheight <= 436504 && realheight > 259163) {
    flyTo(centerlongitude, centerlatitude, controlHeight[4]);
  } else if (realheight <= 259163 && realheight > 164934) {
    flyTo(centerlongitude, centerlatitude, controlHeight[5]);
  } else if (realheight <= 164934 && realheight > 36540) {
    flyTo(centerlongitude, centerlatitude, controlHeight[6]);
  } else if (realheight <= 36540 && realheight > 10493) {
    flyTo(centerlongitude, centerlatitude, controlHeight[7]);
  } else if (realheight <= 10493) {
    flyTo(centerlongitude, centerlatitude, controlHeight[8]);
  }
}
</script>

<style lang="scss" scoped>
.change_box {
  position: relative;
  height: 5rem;
  width: 2rem;
  border-radius: 6px;
  background-color: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .separator {
    position: absolute;
    top: 50%;
    left: 8%;
    transform: translateY(-50%);
    width: 80%;
    height: 1px;
    background-color: gray;
  }

  img {
    cursor: pointer;
    width: 100%;
    height: 45%;
  }
}
</style>
