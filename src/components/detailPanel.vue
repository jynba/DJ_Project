<!--
 * @Descripttion: 地标建筑详情组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-29 17:44:11
 * @LastEditTime: 2023-07-12 16:18:53
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
          <div>河长:{{ detailInfo.riverChief }}</div>
          <div v-for="paragraph in naturalParagraphs">
            <p style="text-indent: 2rem; line-height: 1.5rem">
              {{ paragraph }}
            </p>
          </div>
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

app.config.globalProperties.$eventBus.on("detail", (detail) => {
  popupShow.value = detail.popupShow;
  detailInfo.name = detail.name;
  detailInfo.introduction = detail.intr == "" ? "" : detail.intr;
  detailInfo.pic = detail.pic == "" ? "" : detail.pic;
  detailInfo.riverChief = detail.riverChief;
  let arr = splitIntoParagraphs(detailInfo.introduction);
});

const popupShow = ref(false);
const detailInfo = reactive({
  name: "",
  introduction: "",
  pic: "",
  riverChief: "",
});

//切割段落
const naturalParagraphs = reactive([]);
const splitIntoParagraphs = (paragraph) => {
  const cleanedParagraph = paragraph.replace(/\[.*?\]/g, "");
  const sentences = cleanedParagraph.split("。");

  for (let i = 0; i < sentences.length; i += 3) {
    const paragraphSentences = sentences.slice(i, i + 3);
    const naturalParagraph = paragraphSentences.join("。");
    naturalParagraphs.push(naturalParagraph);
  }
  return naturalParagraphs;
};
</script>

<style scoped>
.cell_title {
  font-weight: 500;
  font-size: 1.5rem;
}
.intr_detaill {
  padding: 0.5rem;
  height: 15rem;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  text-align: justify;
}
</style>
