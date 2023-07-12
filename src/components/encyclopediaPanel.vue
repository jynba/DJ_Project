<!--
 * @Descripttion: 地标建筑详情组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-07-12 19:14:42
-->
<template>
  <div>
    <van-popup
      v-model:show="encyclopediaShow"
      closeable
      round
      :overlay="false"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <!-- <div id="basinStyle">
        <img src="../assets/riverIcon.png" />
        <h2>河流百科</h2>
      </div> -->

      <div class="river_info_box">
        <div class="riverName">{{ riverDetailInfo.name }}</div>
        <div class="riverContent">
          <div>所属流域:东江</div>
          <div>流域面积：{{ riverDetailInfo.scopeArea }}</div>
          <div>河网长度:{{ riverDetailInfo.riverLength }}</div>
          <div>河段出口:{{ riverDetailInfo.riverExit }}</div>
          <div>河长:{{ riverDetailInfo.chiefName }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { app } from "../main.js";
import $ from "jquery";
import qs from "qs";
import axios from "axios";

const encyclopediaShow = ref(false);
//接受河流百科信息
app.config.globalProperties.$eventBus.on("encyclopedia", (encyclopedia) => {
  // console.log("百科数据", encyclopedia);
  console.log("encyclopedia", encyclopedia);
  encyclopediaShow.value = encyclopedia.encyclopediaShow;
  riverDetailInfo.name =
    encyclopedia.name == null ? "暂无信息" : encyclopedia.name;
  riverDetailInfo.scopeArea = encyclopedia.sub_area + "km²";
  riverDetailInfo.riverLength = encyclopedia.cnl_len + "km";
  riverDetailInfo.riverExit = encyclopedia.riverExitText;
  if (encyclopedia.level == 7) {
    //东江流域河长
    riverDetailInfo.chiefName = "黄坤明";
  } else if (encyclopedia.level == 6) {
    //市级河长

    riverDetailInfo.chiefName = encyclopedia.Chief[0].data.name;
  } else if (encyclopedia.level >= 1 && encyclopedia.level <= 5) {
    //县镇级河长
    riverDetailInfo.chiefName = encyclopedia.Chief[1].data.name;
  }
});

const riverDetailInfo = reactive({
  name: "",
  riverScope: "",
  majorTributaries: "",
  riverLevel: "",
  riverCode: "",
  scopeArea: "",
  riverLength: "",
  riverExit: "",
  liveTraffic: "",
  riverInfoCode: "",
  chiefName: "",
  //更多信息
});

/**
 * 方法名：changePosition
 * 创建时间：2023/03/09
 * 作者：龙俊良
 * 功能：用于转换经纬度的格式
 * 用法:
 * @param {String} position 存放经纬度的字符串
 * 返回: 返回为经纬度的度分秒格式
 */
const changePosition = (position) => {
  // 将坐标信息分开
  // 获取度的值，即坐标的整数
  const degree = position.split(".")[0];
  // 获取分的值并处理  将刚刚的小数进行定义
  const decimal = 0 + "." + position.split(".")[1];
  // 将值进行转化，*60即算的是分的值
  let point = decimal * 1 * 60 + "";
  point = point.indexOf(".") > -1 ? point : point + ".0";
  const points = point.split(".")[0];
  // 秒则是在分的小数基础上*60并求整数
  const secondDecimal = 0 + "." + point.split(".")[1];
  const second = (secondDecimal * 1 * 60).toFixed(0);
  return degree + "°" + points + "′" + second + "″";
};
</script>

<style scoped>
#basinStyle {
  width: 100%;
  height: 3rem;
  font-size: 1.5rem;
  color: #f8f8f8;
  background-color: #878787;
  line-height: 3rem;
  text-align: center;
  -webkit-text-stroke: 1px #27292b;
  letter-spacing: 0.16em;
  display: flex;
  justify-content: center;
  img {
    width: 80%;
    height: 80%;
  }
}

.river_info_box {
  padding: 1rem;
}
.riverName {
  position: relative;
  font-size: 26px;
  font-weight: 500;
  border-bottom: #878787;
}
.riverName::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -20%;
  border-top: 1px solid gray;
}

.riverContent {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
