<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 17:39:44
 * @LastEditTime: 2023-07-08 15:39:02
-->
<template>
  <div class="near_box">
    <!-- 定位+搜索栏 -->
    <!-- <near-search class="near-search"></near-search> -->

    <div id="first_row">
      <div class="first_row_col1" @click="getCurrentLocation">
        <!-- <van-icon name="location" /> -->
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="currentSelectedValue"
            :options="cityOption1"
          />
        </van-dropdown-menu>

        <!-- <span>{{ currentLocation }}</span> -->
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
          v-for="(item, index) in gridItems"
          :key="item.text"
          :span="4.8"
        >
          <van-image
            :src="item.image"
            @click="clickClassification(index)"
            fit="contain"
            :class="{ selected: index == selectedImage }"
          />
          <p>{{ item.text }}</p>
        </van-col>
      </van-row>
    </div>
    <!-- 预警通知 -->
    <div class="noticebar">
      <van-swipe class="wanring-swipe" :autoplay="3000" indicator-color="gray">
        <van-swipe-item v-for="item in warningCityArr" :key="item.city">
          <van-image
            class="swiperImage"
            src="./wind/wind-yellow.png"
            fit="contain"
          />
          <div class="wanrn_detaill">
            <div>{{ item.publishtime }}</div>
            <div>{{ item.city }}</div>
            <div>{{ item.warn }}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 分类详情页 -->
    <div class="classification">
      <van-row
        v-show="detailData.length >= 0"
        v-for="item in detailData"
        :key="item.text"
        class="each_classify"
        justify="center"
      >
        <van-col span="10">
          <van-image class="swiperImage" :src="item.image" fit="cover" />
        </van-col>
        <van-col class="each_classify_detail" span="14">
          <div>{{ item.city }}</div>
          <div>{{ item.text }}</div>
        </van-col>
      </van-row>

      <div v-show="detailData.length == 0" class="no_data">暂无数据</div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { getExitLocationName } from "../utils/entity-function/displayArea";
import axios from "axios";
import $ from "jquery";
import qs from "qs";
import nearSearch from "../components/nearSearch.vue";

onMounted(() => {
  //获取当前定位
  getCurrentLocation();
  //获取预警数据
  getwarningData();
  //默认显示第一个数据
  clickClassification(0);
  //获取详情数据
  getDetailData();
});

const currentSelectedValue = ref(1);
const cityOption1 = [
  // { text: "当前定位", value: 0 },
  { text: "东莞", value: 1 },
  { text: "河源", value: 2 },
  { text: "惠州", value: 3 },
  { text: "深圳", value: 4 },
  { text: "广州", value: 5 },
  { text: "韶关", value: 6 },
];

/**
 * @Author: 朱海东
 * @Date: 2023-07-07 15:53:38
 * @name: getwarningData
 * @msg: 获取城市预警数据
 * @return {*}
 */

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}年${month}月${day}日${hour}时${minute}分`;
};

//预警类型对应的图片
let warnImg = [
  {
    name: "高温黄色",
    img: "./",
  },
];
let warningCityArr = reactive([]);
const getwarningData = () => {
  $.ajax({
    url: "http://open.gd121.cn/share/data/getYJ.do?type=json&key=0b9fdc1c7526ae60e6ba59f82453aa3a&logType=warn",
    method: "get",
    success: function (res) {
      console.log(res, "数据判断");
      warningCityArr.push(res.东莞[0]);
      warningCityArr.push(res.河源[0]);
      warningCityArr.push(res.惠州[0]);
      warningCityArr.push(res.深圳[0]);
      warningCityArr.push(res.广州[0]);
      warningCityArr.push(res.韶关[0]);
      //
      warningCityArr.forEach((item) => {
        item.publishtime = formatDate(item.publishtime);
      });
      console.log("warningCityArr", warningCityArr);
    },
  });
};

//分类数据
const gridItems = [
  { image: "./classIcon/stations.png", text: "水文站" },
  { image: "./classIcon/aqueduct.png", text: "人工渠" },
  { image: "./classIcon/river.png", text: "河流" },
  { image: "./classIcon/lake.png", text: "湖泊" },
  { image: "./classIcon/disaster.png", text: "灾害" },
  { image: "./classIcon/humanact.png", text: "人文活动" },
  { image: "./classIcon/cityview.png", text: "城市景点" },
  { image: "./classIcon/heritage.png", text: "文化遗产" },
  { image: "./classIcon/museum.png", text: "博物馆" },
  { image: "./classIcon/more.png", text: "更多" },

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

//所有分类数据
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

//存储详细分类的数据
let detailData = reactive([]);
/**
 * @Author: 朱海东
 * @Date: 2023-07-07 11:12:48
 * @name: clickClassification
 * @msg: 点击获取不同分类的数据
 * @return {*}
 */
const selectedImage = ref(null);
const clickClassification = (clickIndex) => {
  selectedImage.value = clickIndex;
  const filterArr = cateData.filter((item, index) => index === clickIndex);
  detailData.length = 0; // 清空现有数据
  filterArr.forEach((item) => {
    detailData.push(item); // 将每个项目添加到detailData
  });
};

/**
 * @Author: 朱海东
 * @Date: 2023-07-06 16:24:52
 * @name:getCurrentLocation
 * @msg:  获取当前定位
 * @return {*}
 */
const latitude = ref(null);
const longitude = ref(null);
const error = ref(null);
const currentLocation = ref(null);
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
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
  } else {
    error.value = "浏览器不支持地理位置获取";
  }
};

/**
 * @Author: 朱海东
 * @Date: 2023-07-08 10:59:05
 * @name: getDetailData
 * @msg: 获取分类详情的数据
 * @return {*}
 */
const getDetailData = () => {
  const params = {
    type: "lake",
  };
  axios
    .post(IP_ADDRESS_WMS3 + "getDongjiangTypeList", qs.stringify(params))
    .then((res) => {
      console.log("分类数据", res);
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>
<style lang="scss">
.near_box {
  width: 100%;
  height: 100%;
  position: relative;
  .near-search {
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
    // .drop_menu {
    //   width: 1rem;
    // }
    .van-dropdown-menu__bar {
      box-shadow: none;
    }
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
  flex-basis: 20%;
  .van-image {
    width: 60%;
    height: 60%;
  }
}
.selected {
  border-radius: 50%;
  background-color: #d9d9d9;
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
  height: 61%;
  // display: flex;
  // flex-direction: column;

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
  .no_data {
    margin-top: 1rem;
    width: 100%;
    text-align: center;
  }
}
</style>
