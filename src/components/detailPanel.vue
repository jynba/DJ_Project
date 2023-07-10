<!--
 * @Descripttion: 地标建筑详情组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-07-10 15:06:47
-->
<template>
  <div>
    <van-popup
      v-model:show="popupShow"
      closeable
      round
      :overlay="false"
      position="bottom"
      :style="{ height: '37%' }"
    >
      <van-cell-group>
        <van-cell :title="detailInfo.name" class="cell_title" />
        <div class="intr_detaill">
          <div>{{ detailInfo.introduction }}</div>
          <img
            v-if="detailInfo.pic != ''"
            :src="detailInfo.pic"
            referrerpolicy="no-referrer"
          />

          <!-- <van-image v-if="detailInfo.pic.length>0" :src="detailInfo.pic" fit="cover" /> -->
        </div>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { app } from "../main.js";

const popupShow = ref(false);
const detailInfo = reactive({
  name: "",
  introduction: "",
  pic: "",
});
app.config.globalProperties.$eventBus.on("detail", (detail) => {
  popupShow.value = detail.popupShow;
  detailInfo.name = detail.info[0].name;
  detailInfo.introduction = detail.intr == "" ? "暂无数据" : detail.intr;
  detailInfo.pic = detail.pic == "" ? "" : detail.pic;
});
</script>

<style scoped>
.cell_title {
  font-weight: 500;
  font-size: 1.5rem;
}
.intr_detaill {
  padding: 0.5rem;
  height: 9.1rem;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  text-align: justify;
}
</style>
