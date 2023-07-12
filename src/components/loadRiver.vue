<template>
  <div class="iconBox1" @click="initReservoirs">
    <img src="@/assets/reservoirs.png" />
  </div>
  <div class="iconBox2" @click="mapLabels">
    <img src="@/assets/mark.png" />
  </div>
</template>
<script setup>
import { mapLabels, initReservoirs } from "@/utils/common.js";
</script>
<style scoped lang="scss">
.iconBox1 {
  position: absolute;
  top: 29rem;
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
.iconBox2 {
  position: absolute;
  top: 17rem;
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
