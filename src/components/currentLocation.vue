<template>
  <div class="iconBox" @click="getCurrentLocation">
    <img src="@/assets/location.png" />
  </div>
</template>

<script setup>
import { ref } from "vue";

const latitude = ref(null);
const longitude = ref(null);
const error = ref(null);
const currentLocation = ref(null);
const getCurrentLocation = () => {
  console.log(navigator.geolocation);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        console.log(latitude.value, longitude.value);
        // 转换为普通数据
        const lat = latitude.value;
        const lon = longitude.value;
        error.value = null;

        getExitLocationName(lon, lat).then((location) => {
          console.log(location);
          if (location.street) {
            console.log();
            console.log("location.street", location.street);
            currentLocation.value = location.street;
          }
        });
      },
      (error) => {
        error.value = error.message;
        latitude.value = null;
        longitude.value = null;
      },
    );
    flyToLocation();
  } else {
    error.value = "浏览器不支持地理位置获取";
  }
};
const flyToLocation = () => {
  console.log(longitude.value);
  const destination = Cesium.Cartesian3.fromDegrees(23.037759, 113.771723);
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
  z-index: 999;
  cursor: pointer;

  img {
    height: 100%;
    width: 100%;
  }
}
</style>
