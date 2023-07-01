<!--
 * @Descripttion: 地标建筑详情组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-06-30 17:15:58
-->
<template>
  <div>
    <van-popup
      v-model:show="popupShow"
      closeable
      round
      :overlay="false"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-cell-group>
        <van-cell :title="detailInfo.name" class="cell_title" />
        <van-cell :title="detailInfo.introduction"/>
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
});
app.config.globalProperties.$eventBus.on("detail", (detail) => {
  popupShow.value = detail.popupShow;
  detailInfo.name = detail.info[0].name;
  detailInfo.introduction = detail.info[0].introduction==null?'暂无数据':detail.info[0].introduction;
  console.log('detailInfo.introduction',detailInfo.introduction)
});
</script>

<style scoped>
.cell_title {
  font-weight: 500;
  font-size: 1.5rem;
}
</style>
