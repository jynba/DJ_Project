<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-07-12 16:42:36
 * @LastEditTime: 2023-07-13 10:41:00
-->
<template>
  <div class="iconBox" @click="getCurrentLocation">
    <img src="@/assets/location.png" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getExitLocationName } from "../utils/entity-function/displayArea";

const latitude = ref(null);
const longitude = ref(null);
const error = ref(null);
const currentLocation = ref(null);
const getCurrentLocation = () => {
  console.log(navigator.geolocation);
  let pos = {
    lat: 114.1231,
    lon: 23.1231,
    height: 2000,
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        console.log(latitude.value, longitude.value);
        // 转换为普通数据
        pos.lat = latitude.value;
        pos.lon = longitude.value;
        error.value = null;

        getExitLocationName(pos.lon, pos.lat).then((location) => {
          console.log(location);
          if (location.street) {
            console.log("location.street", location.street);
            currentLocation.value = location.street;
            flyToLocation(pos);
          }
        });
      },
      (error) => {
        error.value = error.message;
        latitude.value = null;
        longitude.value = null;
      },
    );
  } else {
    error.value = "浏览器不支持地理位置获取";
  }
};
const flyToLocation = (position) => {
  console.log(longitude.value);
  const destination = Cesium.Cartesian3.fromDegrees(
    position.lon,
    position.lat,
    position.height,
  );
  window.viewer.camera.flyTo({
    destination: destination,
    duration: 5,
  });
};
</script>

<style lang="scss" scoped>
.iconBox {
  position: absolute;
  top: 26rem;
  right: 1rem;
  padding: 3px;
  width: 2rem;
  height: 2rem;
  background-color: #fff;
  border-radius: 6px;
  z-index: 200;
  cursor: pointer;

  img {
    height: 100%;
    width: 100%;
  }
}
</style>
