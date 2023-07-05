<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 17:39:44
 * @LastEditTime: 2023-07-05 15:51:14
-->
<template>
  <div>
    <!-- 定位+搜索栏 -->
    <div id="first_row">
      <div class="first_row_col1">
        <van-icon name="location" />
        <span>松山湖</span>
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
          :span="6">
          <van-image :src="item.image" fit="cover" />
          <p>{{ item.text }}</p>
        </van-col>
      </van-row>
    </div>
    <!-- 预警通知 -->
    <div class="noticebar">
      <van-notice-bar
        left-icon="warning"
        scrollable 
        text="黄磜镇暴雨黄色预警信号继续生效，预计未来2小时我县西部地区将出现20-40毫米强降水，新丰县气象台于2023年07月01日16时17分将分镇暴雨黄色预警信号扩展至全县，请注意防御。"
      />
    </div>
    <!-- 分类详情页 -->
    
  </div>
</template>
<script setup>
import { ref,onMounted} from "vue";
import axios from "axios";

onMounted(() => {
  // getwarningData()
});
const getwarningData=()=>{
  axios.get('https://weather.cma.cn/api/map/alarm', {
  params: {
    adcode: 44
  }
}).then((res)=>{
    const warningData=res.data
    console.log('warningData',warningData)
  })
}


//分类数据
const gridItems = [
  { image: "./bridge.png", text: "水文站" },
  { image: "./park.png", text: "渠道" },
  { image: "./reservoir.png", text: "河流" },
  { image: "./reserve.png", text: "湖泊" },
  { image: "./AI.png", text: "灾害" },
  { image: "./AI.png", text: "人文活动" },
  { image: "./AI.png", text: "城市景点" },
  { image: "./tunnel.png", text: "文化遗产" },
  // 继续添加更多格子的图片和文字
];
</script>
<style lang="scss">
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
}
.noticebar{
    margin-top: 1rem;
}
</style>
