<template>
  <div class="modelToolBar">
    <button @click="showPanel = !showPanel">展示命名面板</button>
  </div>

  <div v-if="showPanel" id="panel2" class="jy-content">
    <div class="title">
      <p class="currentSelect">你当前选择的是：</p>
      <p class="currentSelectRiver">长江-长江-长江</p>
    </div>
    <div class="infoContainer">
      <div class="currentRiverName">
        <p class="title">
          当前河段名<span style="color: red; font-size: 18px">*</span>：
        </p>
        <input type="text" value="长江" class="firstInput" />
        <input type="text" value="长江" class="secondInput" />
      </div>
      <div class="rely">
        <p class="title">
          命名依据<span style="color: red; font-size: 18px">*</span>：
        </p>
        <select id="selectValue" class="selectList" onchange="getBasisValue()">
          <option value="0">所在国标准地图</option>
          <option value="1">镇志</option>
          <option value="2">县志</option>
          <option value="3">市志</option>
          <option value="4">当地相传</option>
          <option value="5">本人考察论证</option>
          <option value="6">其他</option>
        </select>
      </div>
      <div class="riverCode">
        <p class="title">中国河流代码：</p>
        <input type="text" value="111111" />
      </div>
      <div class="average">
        <p class="title">平均流量：</p>
        <input type="text" value="0" />
      </div>
      <div class="pointInfo">
        <p class="title">水文站信息：</p>
        <input type="text" placeholder="选填" />
        <button>匹配信息</button>
      </div>
    </div>
    <div class="bottom">
      <button class="close">关闭</button>
      <button class="confirm" disabled>确认命名</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const showPanel = ref(false);
</script>
<style scoped lang="scss">
.modelToolBar {
  position: absolute;
  left: 200px;
  top: 0;
  z-index: 999;
  margin: 8px;
}

.jy-content {
  border: 1px solid #fff;
  border-radius: 10px;
  z-index: 100000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px 0 20px 10px;
  width: 540px;
  height: 380px;
  background: rgba(4, 9, 27, 0.7);
  color: rgb(239, 229, 241);

  .currentSelect {
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: 700;
  }
  .currentSelectRiver {
    margin-left: 5px;
    font-size: 14px;
  }

  .infoContainer {
    margin: 40px 0 20px 30px;

    .currentRiverName {
      margin-bottom: 20px;
      display: flex;
      .title {
        margin-top: 4px;
      }
      .firstInput {
        margin: 0 10px 0 20px;
        width: 110px;
        height: 25px;
        pointer-events: none;
      }
      .secondInput {
        width: 110px;
        height: 25px;
        pointer-events: none;
      }
    }
    .rely {
      margin-bottom: 20px;
      display: flex;
      .title {
        margin-top: 4px;
      }
      .selectList {
        height: 30px;
        margin-left: 35px;
      }
    }
    .riverCode {
      display: flex;
      margin-bottom: 20px;
      .title {
        margin-top: 5px;
      }
      input {
        margin-left: 9px;
        height: 25px;
        pointer-events: none;
      }
    }
    .average {
      display: flex;
      margin-bottom: 20px;
      .title {
        margin-top: 5px;
      }
      input {
        margin-left: 40px;
        height: 25px;
        pointer-events: none;
      }
    }
    .pointInfo {
      display: flex;
      .title {
        margin-top: 5px;
      }
      input {
        margin: 0 5px 0 22px;
        height: 25px;
        pointer-events: none;
      }
      button {
        padding: 4px 8px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
      }
    }
  }

  .bottom {
    margin: 20px 0 0 148px;
    .close {
      width: 80px;
      margin-right: 10px;
      padding: 4px 8px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
    }
    .confirm {
      width: 80px;
      padding: 4px 8px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
    }
  }
}
</style>
