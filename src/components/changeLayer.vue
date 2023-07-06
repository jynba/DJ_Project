<template>
  <div class="jy-layers">
    <div class="jy-change" @click="showPopup = !showPopup"></div>
  </div>
  <van-popup
    v-model:show="showPopup"
    closeable
    :round="true"
    position="bottom"
    :style="{ height: '30%' }"
  >
    <div class="jy-container">
      <div class="jy-header">
        <strong>图层</strong>
      </div>
      <div class="jy-content">
        <div
          class="jy-content__layer"
          v-for="(item, index) in layers"
          :key="index"
          :class="{ highlightLayer: item.isSelected }"
          :style="{
            backgroundImage: `url(${item.src})`,
          }"
          @click="toggleImageHighlight(index)"
        >
          <p class="jy-Btext" :class="{ highlight: item.isSelected }">
            {{ item.name }}
          </p>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup>
import { ref } from "vue";
import img1 from "@/assets/tdt.png";
import img2 from "@/assets/tdtyx.png";
const showPopup = ref(false);
const layers = ref([
  {
    src: img1,
    isSelected: false,
    name: "天地图",
  },
  {
    src: img2,
    isSelected: false,
    name: "天地图影像",
  },
]);
const toggleImageHighlight = (index) => {
  layers.value.forEach((layers, i) => {
    layers.isSelected = i === index;
  });
};
</script>
<style scoped lang="scss">
@include b(layers) {
  background-color: white;
  position: absolute;
  z-index: 999;
  right: 1rem;
  top: 20rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 3px; /* 图标容器的内边距 */
  box-sizing: border-box; /* 内边距计算方式，包含边框和内边距在内 */
  @include b(change) {
    z-index: 1000;
    background-image: url("../assets/layer.png");
    background-size: cover; /* 调整图标尺寸以适应容器 */
    background-repeat: no-repeat; /* 禁止图标重复 */
    background-position: center center; /* 图标在容器中居中显示 */
    width: 100%; /* 图标的宽度 */
    height: 100%; /* 图标的高度 */
  }
}

@include b(container) {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2rem;
  margin-bottom: 2rem;
  @include b(header) {
    width: 100%;
    height: auto;
    text-align: left;
    margin: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
  @include b(content) {
    height: auto;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    @include e(layer) {
      display: flex;
      align-items: flex-end;
      cursor: pointer;
      border-radius: 10px; /* 将图标容器显示为圆角 */
      border: 1px solid rgba(0, 16, 30, 0.8); /* 边框的样式和颜色 */
      height: 5rem;
      width: 5rem;
      background-image: url("../assets/tdt.png");
      background-size: cover; /* 调整图标尺寸以适应容器 */
      background-repeat: no-repeat; /* 禁止图标重复 */
      background-position: center center; /* 图标在容器中居中显示 */
    }
  }
  @include b(Btext) {
    width: 100%;
    text-align: center;
    font-size: 0.5rem;
    background-color: rgba(0, 16, 30, 0.8);
    color: white;
  }
  .highlightLayer {
    border-color: #00fff6;
  }
  .highlight {
    color: #00fff6;
  }
}
</style>
