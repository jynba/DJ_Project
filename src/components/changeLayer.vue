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
import { onMounted, ref } from "vue";
import * as Cesium from "cesium";
import img1 from "@/assets/tdt.png";
import img2 from "@/assets/tdtyx.png";
import img3 from "@/assets/tdtsg.png";
import img4 from "@/assets/tdtbz.png";
import { watch } from "vue";
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
  {
    src: img3,
    isSelected: false,
    name: "栅格地图",
  },
]);
const toggleImageHighlight = (index) => {
  layers.value.forEach((layers, i) => {
    layers.isSelected = i === index;
  });
  console.log(index);
  const token = "7998f96b301cf185de722d8dadab0479";
  window.viewer.imageryLayers.remove(window.viewer.imageryLayers.get(0));
  if (index == 0) {
    //矢量地图
    window.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
          "&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
          `&style=default&format=tiles&tk=${token}`,
        layer: "tdtCva",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
        ],
        maximumLevel: 18,
      }),
      0,
    );
  } else if (index == 1) {
    //影像地图
    window.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
          "&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
          `&style=default&format=tiles&tk=${token}`,
        layer: "tdtCva",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
        ],
        maximumLevel: 18,
      }),
      0,
    );
  } else if (index == 2) {
    //栅格地图
    window.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.gov.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
          "&LAYER=ter&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
          `&style=default&format=tiles&tk=${token}`,
        layer: "tdtCva",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
        ],
        maximumLevel: 18,
      }),
      0,
    );
  } else if (index == 3) {
    //标记地图
    window.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url:
          "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
          "&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
          `&style=default&format=tiles&tk=${token}`,
        layer: "tdtCva",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "c",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        tileMatrixLabels: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
        ],
        maximumLevel: 18,
      }),
      0,
    );
  }
};
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

watch(isMounted, (newVal) => {
  if (newVal) {
    // 在父组件的 mounted 钩子函数执行完毕后执行子组件的方法
    toggleImageHighlight(1);
  }
});
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
