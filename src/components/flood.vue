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
        <el-button type="primary" @click="finishDraw" :disabled="isDraw"
          >完成绘制</el-button
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

<script>
import * as turf from "@turf/turf";
import { ElNotification } from "element-plus";

let activeShapePoints = [];
let floatingPoint = undefined;
let activeShape = undefined;
let handler = undefined;
let lastStage = null;
export default {
  data() {
    return {
      switchActive: true,
      modelToolBarIsShow: true,
      isDraw: false,
      maxWaterHeight: 2000,
      minWaterHeight: 0,
      warningWaterHeight: 0, // 预警高度
      waterHeight: 0,
      waterHeightShow: false,
      speed: "1",
      waterHeightTimeer: 0,
      waterPrimitive: undefined,
      tempEntities: [],
      warningWaterHeightDisabled: false,
      // 下雨特效
      showFlood: false,
    };
  },
  beforeDestroy() {
    // 关闭当前组件之前清除所有数据
    this.handCloserModel();
  },
  methods: {
    // 清除特效
    removeStage() {
      lastStage && window.viewer.scene.postProcessStages.remove(lastStage),
        (lastStage = null);
    },
    rain() {
      this.removeStage();
      var e = new Cesium.PostProcessStage({
        name: "czm_rain",
        fragmentShader: FS_Rain(),
      });
      viewer.scene.postProcessStages.add(e), (lastStage = e);
      function FS_Rain() {
        return "uniform sampler2D colorTexture;\n\
        varying vec2 v_textureCoordinates;\n\
      \n\
        float hash(float x){\n\
          return fract(sin(x*23.3)*13.13);\n\
      }\n\
      \n\
      void main(void){\n\
      \n\
        float time = czm_frameNumber / 60.0;\n\
      vec2 resolution = czm_viewport.zw;\n\
      \n\
      vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
      vec3 c=vec3(.6,.7,.8);\n\
      \n\
      float a=-.4;\n\
      float si=sin(a),co=cos(a);\n\
      uv*=mat2(co,-si,si,co);\n\
      uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
      \n\
      float v=1.-sin(hash(floor(uv.x*100.))*100.);\n\
      float b=clamp(abs(sin(15.*time*v+uv.y*(10./(2.+v))))-.95,0.,1.)*4.;\n\
      c*=v*b; \n\
      \n\
      gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5);  \n\
      }\n\
";
      }
    },
    flyToLocation() {
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
        // complete: () => {
        //   console.log(this.showFlood);
        //   this.showFlood = true;
        // },
      });
    },
    toggleFlood() {
      // this.flyToLocation();
      this.showFlood = !this.showFlood;
    },
    handCloserModel() {
      this.modelToolBarIsShow = false;
      this.clearAllEntities();
    },
    /**
     * @author:
     * @Date: 2022-11-13 16:44:02
     * @note: 注意事项
     * @description: 绘制范围
     */
    drawExtent() {
      if (viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
        this.$modal.msgWarning("请先开启地形！");
        return;
      }
      // 开启深度检测
      window.viewer.scene.globe.depthTestAgainstTerrain = true;
      handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);

      handler.setInputAction((event) => {
        const earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          if (activeShapePoints.length === 0) {
            floatingPoint = this.createPoint(earthPosition);
            activeShapePoints.push(earthPosition);
            const dynamicPositions = new Cesium.CallbackProperty(function () {
              return new Cesium.PolygonHierarchy(activeShapePoints);
            }, false);
            activeShape = this.drawShape(dynamicPositions, Cesium.Color.RED);
          }
          activeShapePoints.push(earthPosition);
          this.tempEntities.push(this.createPoint(earthPosition));
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
    },

    finishDraw() {
      if (activeShapePoints.length < 3) return;

      this.tempEntities.push(this.drawPolyline(activeShapePoints));

      let ploy = this.drawShape(
        activeShapePoints,
        Cesium.Color.fromBytes(64, 157, 253, 20),
      );
      this.tempEntities.push(ploy);
      this.getAreaHeight(activeShapePoints);

      console.log(this.tempEntities, "tempEntities");
      console.log(activeShapePoints, "activeShapePoints");

      window.viewer.entities.remove(floatingPoint);
      window.viewer.entities.remove(activeShape);
      floatingPoint = undefined;
      activeShape = undefined;
      handler.destroy(); // 关闭事件句柄
      handler = null;
    },
    /**
     * @author:
     * @Date: 2022-11-13 16:48:43
     * @note: 注意事项
     * @description: 获取区域内最大最小高程
     * @param {*} positions
     */
    getAreaHeight(positions) {
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
        this.waterHeight = Math.ceil(min);
        this.minWaterHeight = Math.ceil(min);
        this.maxWaterHeight = Math.ceil(max);
        this.warningWaterHeight = Math.ceil(max);
        // 禁用绘制按钮
        this.isDraw = !this.isDraw;
        this.warningWaterHeightDisabled = false;
      });
    },

    /**
     * @author:
     * @Date: 2022-11-13 16:46:47
     * @note: 注意事项
     * @description: 创建点
     * @param {*} worldPosition
     */
    createPoint(worldPosition) {
      const point = window.viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      return point;
    },

    /**
     * @author:
     * @Date: 2022-11-13 16:46:37
     * @note: 注意事项
     * @description: 绘制多边形
     * @param {*} positionData
     * @param {*} mat
     */
    drawShape(positionData, mat) {
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
    },

    /**
     * @author:
     * @Date: 2022-11-13 16:46:11
     * @note: 注意事项
     * @description: 绘制线
     * @param {*} positions
     */
    drawPolyline(positions) {
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
    },

    /**
     * @author:
     * @Date: 2022-11-13 16:45:05
     * @note: 注意事项
     * @description: 淹没分析
     */
    induationAnalysis() {
      this.rain();
      if (
        Number(this.warningWaterHeight) < Number(this.minWaterHeight) ||
        Number(this.warningWaterHeight) > Number(this.maxWaterHeight)
      ) {
        ElNotification({
          message: "预警高度必须在最大高度和最小高度之间",
          type: "warning",
        });
        return;
      }
      this.warningWaterHeightDisabled = true;
      let shape = window.viewer.entities.add({
        polygon: {
          hierarchy: activeShapePoints,
          material: Cesium.Color.fromBytes(64, 157, 253, 20),
          extrudedHeight: Number(this.warningWaterHeight),
          outline: true,
          outlineColor: Cesium.Color.RED,
          outlineWidth: 4,
          // perPositionHeight: true
        },
      });
      this.tempEntities.push(shape);

      this.waterHeightShow = true;
      this.waterHeight = Number(this.minWaterHeight);
      const en = window.viewer.entities.add({
        polygon: {
          hierarchy: activeShapePoints,
          extrudedHeight: new Cesium.CallbackProperty(() => {
            return this.waterHeight;
          }, false),
          material: Cesium.Color.fromBytes(64, 157, 253, 150),
        },
      });
      this.tempEntities.push(en);

      this.waterHeightTimeer = setInterval(() => {
        this.waterHeight += Number(this.speed);

        let l =
          this.speed.split(".").length > 1
            ? this.speed.split(".")[1].length
            : 0;
        this.waterHeight = Number(this.waterHeight.toFixed(l));
        this.maxWaterHeight = Number(this.maxWaterHeight);
        this.minWaterHeight = Number(this.minWaterHeight);
        if (
          this.waterHeight > this.maxWaterHeight ||
          this.waterHeight < this.minWaterHeight
        ) {
          clearInterval(this.waterHeightTimeer);
          this.waterHeight =
            this.waterHeight > this.maxWaterHeight
              ? this.maxWaterHeight
              : this.minWaterHeight;
        }
      }, 1000);
      // 手动触发屏幕渲染更新
      window.viewer.scene.requestRender();
    },

    /**
     * @author:
     * @Date: 2022-11-13 16:44:42
     * @note: 注意事项
     * @description: 清除当前页面所有数据
     */
    clearAllEntities() {
      this.removeStage();
      if (this.waterHeightTimeer) {
        clearInterval(this.waterHeightTimeer);
      }
      this.positions = [];
      const length = this.tempEntities.length;
      for (let f = 0; f < length; f++) {
        window.viewer.entities.remove(this.tempEntities[f]);
      }
      this.tempEntities = [];
      this.waterHeightShow = false;
      activeShapePoints = [];
      this.warningWaterHeight = 0;
      this.isDraw = !this.isDraw;
      floatingPoint = undefined;
      activeShape = undefined;
      if (handler) {
        handler.destroy(); // 关闭事件句柄
        handler = undefined;
      }
    },
  },
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
