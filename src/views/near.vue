<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 17:39:44
 * @LastEditTime: 2023-07-06 17:48:07
-->
<template>
  <div class="near_box">
    <!-- 定位+搜索栏 -->
     <near-search class="near-search"></near-search>
    
    <div id="first_row">
      <div class="first_row_col1" @click="getCurrentLocation">
        <van-icon name="location" />
        <span>{{ currentLocation }}</span>
      </div>
      <div class="first_row_col2">
        <van-search
          v-model="value"
          placeholder="搜索附近"
          @search="onSearch"
          @cancel="onCancel"
        />
      </div>
    </div>
    <!-- 分类 -->
    <div>
      <van-row>
        <van-col
          id="each_detail"
          v-for="item in gridItems"
          :key="item.text"
          :span="4.8"
        >
          <van-image :src="item.image" fit="contain" />
          <p>{{ item.text }}</p>
        </van-col>
      </van-row>
    </div>
    <!-- 预警通知 -->
    <div class="noticebar">
      <van-swipe class="wanring-swipe" :autoplay="3000" indicator-color="gray">
        <van-swipe-item v-for="item in warningData" :key="item.text">
          <van-image class="swiperImage" :src="item.image" fit="contain" />
          <div class="wanrn_detaill">
            <div>{{ item.time }}</div>
            <div>{{ item.city }}</div>
            <div>{{ item.text }}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 分类详情页 -->
    <div class="classification">
      <van-row
        v-for="item in cateData"
        :key="item.text"
        class="each_classify"
        justify="center"
      >
        <van-col span="10">
          <van-image
            class="swiperImage"
            :src="item.image"
            fit="cover"
          />
        </van-col>
        <van-col class="each_classify_detail" span="14">
          <div>{{ item.city }}</div>
          <div>{{ item.text }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {getExitLocationName} from '../utils/entity-function/displayArea'
import axios from "axios";
import nearSearch from "../components/nearSearch.vue"

onMounted(() => {
  //获取当前定位
  getCurrentLocation()
  // getwarningData()
});
const getwarningData = () => {
  axios
    .get("https://weather.cma.cn/api/map/alarm", {
      params: {
        adcode: 44,
      },
    })
    .then((res) => {
      const warningData = res.data;
      // console.log("warningData", warningData);
    });
};

//分类数据
const gridItems = [
  { image: "./bridge.png", text: "水文站" },
  { image: "./park.png", text: "人工渠" },
  { image: "./reservoir.png", text: "河流" },
  { image: "./reserve.png", text: "湖泊" },
  { image: "./AI.png", text: "灾害" },
  { image: "./AI.png", text: "人文活动" },
  { image: "./AI.png", text: "城市景点" },
  { image: "./tunnel.png", text: "文化遗产" },
  { image: "./tunnel.png", text: "博物馆" },
  { image: "./tunnel.png", text: "更多" },

  // 继续添加更多格子的图片和文字
];

//预警图标
const warningData = [
  {
    image: "./wind/wind-blue.png",
    text: "普宁市气象台发布大风蓝色预警",
    time: "2023年7月6日",
    city: "普宁市",
    back: "red",
  },
  {
    image: "./wind/wind-orange.png",
    text: "河源市气象台发布大风橙色预警",
    time: "2023年7月7日",
    city: "河源市",
    back: "red",
  },
  {
    image: "./wind/wind-red.png",
    text: "东莞市气象台发布大风红色色预警",
    time: "2023年7月10日",
    city: "东莞市",
    back: "red",
  },
];

//分类数据
const cateData = [
  {
    image: "./testdetail.png",
    text: "广东省河源市和平县优胜镇，辖区面积117.31平方千米",
    city: "优胜镇",
  },
  {
    image: "./testdetail.png",
    text: "广东省河源市和平县上陵镇，辖区面积117.31平方千米",
    city: "上陵镇",
  },
  {
    image: "./testdetail.png",
    text: "广东省河源市和平县合水镇，辖区面积147.31平方千米",
    city: "合水镇",
  },
  {
    image: "./testdetail.png",
    text: "广东省河源市和平县下车镇，辖区面积107.31平方千米",
    city: "下车镇",
  },
  {
    image: "./testdetail.png",
    text: "广东省河源市和平县长安镇，辖区面积116.31平方千米）",
    city: "长安镇",
  },
];


/**
 * @Author: 朱海东
 * @Date: 2023-07-06 16:24:52
 * @name: 获取当前定位
 * @msg: 
 * @return {*}
 */
const latitude = ref(null);
const longitude = ref(null);
const error = ref(null);
const currentLocation = ref(null);
const getCurrentLocation=()=>{
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        // 转换为普通数据
        const lat = latitude.value;
        const lon = longitude.value;
        error.value = null;
     
        getExitLocationName(lon,lat).then((location)=>{
          console.log(location)
          if(location.street){
            console.log()
            console.log('location.street',location.street)
            currentLocation.value=location.street
          }

        })
       
      },
      (error) => {
        error.value = error.message;
        latitude.value = null;
        longitude.value = null;
      }
    );
  } else {
    error.value = '浏览器不支持地理位置获取';
  }
}


</script>
<style lang="scss">
.near_box {
  width: 100%;
  height: 100%;
  position: relative;
  .near-search{
    position: absolute;
    top: 0;
    left: 0;
  }
}
#first_row {
  width: 100%;
  display: flex;
  white-space: nowrap;
  .first_row_col1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    flex: 1;
  }
  .first_row_col2 {
    flex: auto;
  }
}
#each_detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-basis: 20%;
}
.noticebar {
  margin-top: 1rem;
}

//指示器
.van-swipe__indicators {
  i {
    background-color: gray;
  }
  bottom: 1%;
}

.wanring-swipe .van-swipe-item {
  width: 100%;
  // padding: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: black;
  height: 5.25rem;
  font-size: 1.25rem;
  // line-height: 150px;
  text-align: center;
  background-color: #fffbe8;
  display: flex;
  .swiperImage {
    width: 35%;
  }
  .wanrn_detaill {
    margin-left: 0.5rem;
    font-size: 1rem;
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
  }
}

.classification {
  background-color: #f6f6f6;
  padding: 0.5rem;
  overflow: scroll;
  height: 50%;

  .each_classify {
    margin-top: 0.4rem;
    background-color: white;

    .each_classify_detail {
      text-align: justify;
      text-justify: inter-word;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      div:first-child {
        font-size: 1.625rem;
        font-weight: 500;
      }
    }
  }
}
</style>
