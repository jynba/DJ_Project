<template>
  <div class="jy-flood">
    <div class="jy-flood__inner" @click="toggleFlood()"></div>
  </div>
  <div>
    <div class="Tool-template ToolBar" v-if="showFlood">
      <span>淹没分析</span>
      <div class="splitline"></div>
      <div class="app-container">
        <el-button type="primary" @click="drawExtent" :disabled="isDraw"
          >绘制范围</el-button
        >
        <el-button type="primary" @click="induationAnalysis" :disabled="!isDraw"
          >淹没分析</el-button
        >
        <el-button type="primary" @click="clearAllEntities" :disabled="!isDraw"
          >清除</el-button
        >
        <div class="water-bartool">
          最大高度：<el-input v-model="maxWaterHeight" disabled></el-input
          >&nbsp;&nbsp;米
        </div>
        <div class="water-bartool">
          最小高度：<el-input v-model="minWaterHeight" disabled></el-input
          >&nbsp;&nbsp;米
        </div>
        <div class="water-bartool">
          预警高度：<el-input
            v-model="warningWaterHeight"
            :disabled="warningWaterHeightDisabled"
          ></el-input
          >&nbsp;&nbsp;米
        </div>
        <div class="water-bartool">
          淹没速度：<el-input v-model="speed"></el-input>&nbsp;&nbsp;m/s
        </div>
        <div class="water-bartool" v-show="waterHeightShow">
          实时高度：<span class="waterInfo">{{ waterHeight }}</span
          >&nbsp;&nbsp;m
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as turf from "@turf/turf";
import { reactive } from "vue";
import { ref } from "vue";
import { onBeforeUnmount } from "vue";
// 飞到东中路
const flyToLocation = () => {
  const latitude = 23.037759;
  const longitude = 113.771723;
  const height = 1000;

  const destination = Cesium.Cartesian3.fromDegrees(
    longitude,
    latitude,
    height,
  );
  window.viewer.camera.flyTo({
    destination: destination,
    duration: 5,
    complete: function () {
      showFlood.value = !showFlood.value;
    },
  });
};
const toggleFlood = () => {
  flyToLocation();
};

let activeShapePoints = reactive([]);
let floatingPoint = undefined;
let activeShape = undefined;
let handler = undefined;

let isDraw = ref(false);
let maxWaterHeight = ref(2000);
let minWaterHeight = ref(0);
let warningWaterHeight = ref(0); // 预警高度
let waterHeight = ref(0);
let waterHeightShow = false;
let speed = ref("1");
let waterHeightTimeer = 0;
let waterPrimitive = undefined;
let tempEntities = reactive([]);
let warningWaterHeightDisabled = ref(false);
const showFlood = ref(false);
onBeforeUnmount(() => {
  // 关闭当前组件之前清除所有数据
  handCloserModel();
});

const handCloserModel = () => {
  clearAllEntities();
};
/**
 * @author:
 * @Date: 2022-11-13 16:44:02
 * @note: 注意事项
 * @description: 绘制范围
 */
const drawExtent = () => {
  if (
    window.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
  ) {
    ElNotification({
      type: "warning",
      message: "请先开启地形！",
    });
    return;
  }
  // 开启深度检测
  window.viewer.scene.globe.depthTestAgainstTerrain = true;
  handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);

  handler.setInputAction((event) => {
    const earthPosition = viewer.scene.pickPosition(event.position);
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(activeShapePoints);
        }, false);
        activeShape = drawShape(dynamicPositions, Cesium.Color.RED);
      }
      activeShapePoints.push(earthPosition);
      tempEntities.push(createPoint(earthPosition));
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((event) => {
    if (Cesium.defined(floatingPoint)) {
      const newPosition = viewer.scene.pickPosition(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction((event) => {
    activeShapePoints.pop();
    if (activeShapePoints.length < 3) return;

    tempEntities.push(drawPolyline(activeShapePoints));
    let ploy = drawShape(
      activeShapePoints,
      Cesium.Color.fromBytes(64, 157, 253, 20),
    );
    tempEntities.push(ploy);

    getAreaHeight(activeShapePoints);

    window.viewer.entities.remove(floatingPoint);
    window.viewer.entities.remove(activeShape);
    floatingPoint = undefined;
    activeShape = undefined;
    handler.destroy(); // 关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

/**
 * @author:许佳宇
 * @Date: 2023/7/10
 * @note: 注意事项
 * @description: 绘制范围
 */
const drawDongZhong = () => {};

/**
 * @author:
 * @Date: 2022-11-13 16:48:43
 * @note: 注意事项
 * @description: 获取区域内最大最小高程
 * @param {*} positions
 */
const getAreaHeight = (positions) => {
  let startP = positions[0];
  let endP = positions[positions.length - 1];
  if (startP.x != endP.x && startP.y != endP.y && startP.z != endP.z)
    positions.push(positions[0]);

  const tempPoints = [];
  for (let i = 0; i < positions.length; i++) {
    var ellipsoid = window.viewer.scene.globe.ellipsoid;
    var cartographic = ellipsoid.cartesianToCartographic(positions[i]);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    tempPoints.push([lng, lat]);
  }
  var line = turf.lineString(tempPoints);
  var chunk = turf.lineChunk(line, 10, { units: "meters" });

  const tempArray = [];
  chunk.features.forEach((f) => {
    f.geometry.coordinates.forEach((c) => {
      tempArray.push(Cesium.Cartographic.fromDegrees(c[0], c[1]));
    });
  });

  var promise = Cesium.sampleTerrainMostDetailed(
    window.viewer.terrainProvider,
    tempArray,
  ).then((updatedPositions) => {
    const max = Math.max.apply(
      Math,
      updatedPositions.map((item) => {
        return item.height;
      }),
    );
    const min = Math.min.apply(
      Math,
      updatedPositions.map((item) => {
        return item.height;
      }),
    );

    waterHeight.value = Math.ceil(min);
    minWaterHeight.value = Math.ceil(min);
    maxWaterHeight.value = Math.ceil(max);
    // 禁用绘制按钮
    isDraw.value = !isDraw.value;
    warningWaterHeightDisabled.value = false;
  });
};

/**
 * @author:
 * @Date: 2022-11-13 16:46:47
 * @note: 注意事项
 * @description: 创建点
 * @param {*} worldPosition
 */
const createPoint = (worldPosition) => {
  const point = window.viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.SKYBLUE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return point;
};
/**
 * @author:
 * @Date: 2022-11-13 16:46:37
 * @note: 注意事项
 * @description: 绘制多边形
 * @param {*} positionData
 * @param {*} mat
 */
const drawShape = (positionData, mat) => {
  let shape = window.viewer.entities.add({
    polygon: {
      hierarchy: positionData,
      material: mat,
      outline: true,
      outlineColor: Cesium.Color.SKYBLUE,
      outlineWidth: 4,
    },
  });
  return shape;
};

/**
 * @author:
 * @Date: 2022-11-13 16:46:11
 * @note: 注意事项
 * @description: 绘制线
 * @param {*} positions
 */
const drawPolyline = (positions) => {
  if (positions.length < 1) return;

  let startP = positions[0];
  let endP = positions[positions.length - 1];
  if (startP.x != endP.x && startP.y != endP.y && startP.z != endP.z)
    positions.push(positions[0]);

  return window.viewer.entities.add({
    name: "polyline",
    polyline: {
      positions: positions,
      width: 2.0,
      material: Cesium.Color.SKYBLUE,
      clampToGround: true,
    },
  });
};
/**
 * @author:
 * @Date: 2022-11-13 16:45:05
 * @note: 注意事项
 * @description: 淹没分析
 */
const induationAnalysis = () => {
  console.log(warningWaterHeight.value);
  console.log(maxWaterHeight.value);
  console.log(minWaterHeight.value);
  console.log(activeShapePoints, "activepos");
  console.log(tempEntities, "tempE");
  let tmpPos = [
    {
      x: -2367174.215778246,
      y: 5374114.035657404,
      z: 2480834.0670244945,
    },
    {
      x: -2367088.203347616,
      y: 5374433.979880874,
      z: 2480227.0527583696,
    },
    {
      x: -2367153.0441021663,
      y: 5374413.848992698,
      z: 2480208.912923143,
    },
    {
      x: -2367221.3786056293,
      y: 5374095.149759812,
      z: 2480830.003463956,
    },
    {
      x: -2367174.215778246,
      y: 5374114.035657404,
      z: 2480834.0670244945,
    },
  ];

  if (
    Number(warningWaterHeight.value) < Number(minWaterHeight.value) ||
    Number(warningWaterHeight.value) > Number(maxWaterHeight.value)
  ) {
    ElNotification({
      message: "预警高度必须在最大高度和最小高度之间",
      type: "warning",
    });
    return;
  }
  warningWaterHeightDisabled.value = true;
  let shape = window.viewer.entities.add({
    polygon: {
      hierarchy: activeShapePoints,
      material: Cesium.Color.fromBytes(64, 157, 253, 20),
      extrudedHeight: Number(warningWaterHeight.value),
      outline: true,
      outlineColor: Cesium.Color.RED,
      outlineWidth: 4,
      // perPositionHeight: true
    },
  });
  tempEntities.push(shape);

  waterHeightShow = true;
  waterHeight.value = Number(minWaterHeight.value);
  const en = window.viewer.entities.add({
    polygon: {
      hierarchy: activeShapePoints,
      extrudedHeight: new Cesium.CallbackProperty(() => {
        return waterHeight.value;
      }, false),
      material: Cesium.Color.fromBytes(64, 157, 253, 150),
    },
  });
  tempEntities.push(en);

  waterHeightTimeer = setInterval(() => {
    waterHeight.value += Number(speed.value);

    let l =
      speed.value.split(".").length > 1 ? speed.value.split(".")[1].length : 0;
    waterHeight.value = Number(waterHeight.value.toFixed(l));
    maxWaterHeight.value = Number(maxWaterHeight.value);
    minWaterHeight.value = Number(minWaterHeight.value);
    if (
      waterHeight.value > maxWaterHeight.value ||
      waterHeight.value < minWaterHeight.value
    ) {
      clearInterval(waterHeightTimeer);
      waterHeight.value =
        waterHeight.value > maxWaterHeight.value
          ? maxWaterHeight.value
          : minWaterHeight.value;
    }
  }, 1000);
};

/**
 * @author:
 * @Date: 2022-11-13 16:44:42
 * @note: 注意事项
 * @description: 清除当前页面所有数据
 */
const clearAllEntities = () => {
  if (waterHeightTimeer) {
    clearInterval(waterHeightTimeer);
  }

  const length = tempEntities.length;
  for (let f = 0; f < length; f++) {
    window.viewer.entities.remove(tempEntities[f]);
  }
  tempEntities = [];
  waterHeightShow = false;
  activeShapePoints = reactive([]);
  warningWaterHeight.value = 0;
  isDraw = !isDraw;
  floatingPoint = undefined;
  activeShape = undefined;
  if (handler) {
    handler.destroy(); // 关闭事件句柄
    handler = undefined;
  }
};
</script>

<style lang="scss" scoped>
@include b(flood) {
  background-color: white;
  position: absolute;
  z-index: 999;
  right: 1rem;
  top: 23rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 6px;
  padding: 3px; /* 图标容器的内边距 */
  box-sizing: border-box; /* 内边距计算方式，包含边框和内边距在内 */
  @include e(inner) {
    z-index: 1000;
    background-image: url("../assets/flood.png");
    background-size: cover; /* 调整图标尺寸以适应容器 */
    background-repeat: no-repeat; /* 禁止图标重复 */
    background-position: center center; /* 图标在容器中居中显示 */
    width: 100%; /* 图标的宽度 */
    height: 100%; /* 图标的高度 */
  }
}

.Tool-template {
  background-color: white;
  height: auto;
  width: auto;
  position: relative;
  margin: 1rem;
}
.ToolBar {
  position: absolute;
  right: 2rem;
  z-index: 999;
}
.splitline {
  border: 2px solid #666;
}
.water-bartool {
  margin-top: 10px;

  .waterInfo {
    font-size: 16px;
    font-weight: 600;
    color: red;
  }
}

.el-input {
  width: 120px;

  .el-input__inner {
    text-align: center;
  }
}
</style>
