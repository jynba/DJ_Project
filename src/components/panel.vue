<template>
  <!-- <div class="modelToolBar">
		<button @click="showPanel = !showPanel">展示命名面板</button>
	</div> -->

  <div v-if="props.showPanel" id="panel2" class="jy-content">
    <div class="title">
      <p class="currentSelect">你当前选择的是：</p>
      <p class="currentSelectRiver">
        {{ select_river }}
      </p>
    </div>
    <div v-if="props.hasLast">
      <p style="color: white">请先命名上一级河流</p>
      <button class="confirm" @click="$emit('namedLast')">命名上一级</button>
      <button class="close" @click="closeBox()">关闭</button>
    </div>
    <div v-else>
      <div class="infoContainer">
        <div class="currentRiverName">
          <p class="title">
            当前河段名<span style="color: red; font-size: 18px">*</span>：
          </p>
          <input type="text" class="firstInput" v-model="zh_name" />
          <input type="text" class="secondInput" v-model="en_name" />
        </div>
        <div class="rely">
          <p class="title">
            命名依据<span style="color: red; font-size: 18px">*</span>：
          </p>
          <select id="selectValue" v-model="naming_reason" class="selectList">
            <option value="0">所在国标准地图</option>
            <option value="1">镇志</option>
            <option value="2">县志</option>
            <option value="3">市志</option>
            <option value="4">当地相传</option>
            <option value="5">本人考察论证</option>
          </select>
        </div>
        <div class="riverCode">
          <p class="title">中国河流代码：</p>
          <input type="text" v-model="riverCode" />
        </div>
        <div class="average">
          <p class="title">平均流量：</p>
          <input type="text" v-model="averageFlow" />
        </div>
        <div class="pointInfo">
          <p class="title">水文站信息：</p>
          <input type="text" placeholder="选填" v-model="station_name" />
          <button>匹配信息</button>
        </div>
      </div>
      <div class="bottom">
        <button class="close" @click="closeBox()">关闭</button>
        <button class="confirm" @click="checkRiverForm()">确认命名</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import request from "../utils/request";
import { toRefs } from "vue";
const props = defineProps(["showPanel", "hasLast", "formData"]);
const emit = defineEmits(["close", "namedLast"]);
const {
  zh_name,
  select_river,
  averageFlow,
  naming_reason,
  station_name,
  riverCode,
  en_name,
} = toRefs(props.formData); // 选择的河流

// 命名依据数组
const SELECT_LIST = [
  {
    value: "0",
    text: "所在国标准地图",
  },
  {
    value: "1",
    text: "镇志",
  },
  {
    value: "2",
    text: "县志",
  },
  {
    value: "3",
    text: "市志",
  },
  {
    value: "4",
    text: "当地相传",
  },
  {
    value: "5",
    text: "本人考察论证",
  },
];
// 用于控制提交命名内容的重复点击
let SUBMIT_FLAG = false;
// 定义河流的链式名称文本
let CHAINED_TEXT = "";

/**
 * 方法名：checkRiverForm
 * 创建时间：2023/06/5
 * 作者: 许佳宇
 * 功能：校验命名盒子的信息输入情况并提交
 */
const checkRiverForm = () => {
  console.log(111);
  console.log(SUBMIT_FLAG);
  if (!SUBMIT_FLAG) {
    // 校验河流中文名
    if (zh_name.value == "" || zh_name.value == "未命名") {
      ElNotification({
        message: "请输入河流中文名",
        type: "warning",
        duration: 1000,
      });
    } else if (naming_reason.value == "") {
      ElNotification({
        title: "Error",
        message: "请选择命名依据",
        type: "error",
        duration: 1000,
      });
      console.log("请选择命名依据");
    }
    // 判断河流名是否为空且是否满足'未命名'
    else {
      SUBMIT_FLAG = true;
      submitRiverLogForm();
    }
  }
};
/**
 * 方法名：changeDate
 * 创建时间：2023/06/6
 * 作者: 许佳宇
 * 功能：处理当前时间
 * 返回值：时间格式为xxxx-xx-xx
 */
const changeDate = () => {
  // 获取当前时间
  let nowTime = new Date();
  // 获取当前时间的年份
  let year = nowTime.getFullYear();
  // 获取当前时间的月份，如果小于等于9，则需要在前面加0
  let month =
    nowTime.getMonth() >= 9
      ? nowTime.getMonth() * 1 + 1
      : "0" + (nowTime.getMonth() * 1 + 1);
  // 获取当前时间的日期，如果小于等于9，则需要在前面加0
  let day = nowTime.getDate() > 9 ? nowTime.getDate() : "0" + nowTime.getDate();
  return year + "-" + month + "-" + day;
};

const showSources = () => {
  return SELECT_LIST.find((i) => i.value == naming_reason.value).text;
};

/**
 * 方法名：submitRiverNameForm
 * 创建时间：2023/02/24
 * 作者: 龙俊良
 * 功能：提交命名表单内容  用于更新河网数据表的内容
 */
const submitRiverNameForm = () => {
  const tmp = {
    // 河流名
    rivername: zh_name.value.replace("@", "-"),
    // 平均流量
    discharge: averageFlow.value == "" ? 0 : averageFlow.value,
    channelid: window.$selectedRiver?.channelid,
    // 河网级别
    level: window?.$selectedRiver?.level,
    hierarcode: window.$selectedRiver.hierarcode.toString(),
    basincode: window.$selectedRiver?.basincode,
    // 中国河流代码
    shuilicode: riverCode.value == "" ? "" : riverCode.value,
    // 当前需要插入的河段位于哪个河网表
    tablelocation: window.$selectedRiver.tablelocation,
  };
  request({
    url: IP_ADDRESS_WMS3 + "/submitDongjiangTmp",
    method: "POST",
    data: tmp,
  })
    .then((res) => {
      console.log(tmp, "tmp");
      console.log(res, "改名成功");
      removeRiverNameForm();
      SUBMIT_FLAG = false;
    })
    .catch((err) => {
      console.log(err);
      SUBMIT_FLAG = false;
    });
};

/**
 * 方法名：submitRiverLogForm
 * 创建时间：2023/06/5
 * 作者: 许佳宇
 * 功能：提交表单内容（提交到河流日志表）
 */
const submitRiverLogForm = () => {
  console.log(window.$selectedRiver);
  // 存放日志表的各个字段
  const tmp = {
    // 河流名
    rivername: zh_name.value.replace("@", "-"),
    // 河网级别
    level: window?.$selectedRiver?.level,
    channelid: window.$selectedRiver?.channelid,
    // 用户账号
    // username: globalusername,
    hierarcode: window.$selectedRiver.hierarcode.toString(),
    basincode: window.$selectedRiver?.basincode,
    // 获取当前的时间
    recorddate: changeDate(),
    // 命名依据的字段
    source: showSources(),
    // 中国河流代码
    shuilicode: riverCode.value == "" ? "" : riverCode.value,
    // 平均流量
    discharge: averageFlow.value == "" ? 0 : averageFlow.value,
    // 用于存放链式结构的名字
    full_name:
      CHAINED_TEXT == "" ? zh_name.value.replace("-", "@") : CHAINED_TEXT,
    // 英文名
    englishname: en_name.value,
    regioncode: window.$selectedRiver.regioncode,
    // 当前需要插入的河段位于哪个河网表
    tablelocation: window.$selectedRiver.tablelocation,
    // 日志表
    riverlocation: "dongjiang_log",
    // 水文站
    staionname: station_name.value == "" ? "" : station_name.value,
  };
  console.log("request");

  request({
    url: IP_ADDRESS_WMS3 + "/submitDongjiang",
    method: "POST",
    data: tmp,
  })
    .then((res) => {
      console.log(res, tmp, "res");
      //隐藏table
      emit("close", false);
      //隐藏高亮
      window.viewer.entities.removeAll();
      // submitRiverNameForm();
      ElNotification({
        message: "命名成功！",
        type: "success",
        duration: 1000,
      });
      submitRiverNameForm();
    })
    .catch((err) => {
      console.log(err);
      SUBMIT_FLAG = false;
      ElNotification({
        message: "提交失败",
        type: "error",
        duration: 1000,
      });
    });
};

/**
 * 方法名：removeRiverNameForm
 * 创建时间：2023/06/6
 * 作者: 许佳宇
 * 功能：移除命名界面的提示
 */
const removeRiverNameForm = () => {
  // 将输入框内容清空
  zh_name.value = "未命名";
  en_name.value = "";
  riverCode.value = "";
  averageFlow.value = "";
  station_name.value = "";
};

const closeBox = () => {
  removeRiverNameForm();
  emit("close", false);
};
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
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px 0 20px 10px;
  width: 540px;
  height: 380px;
  background: rgba(4, 9, 27, 0.7);

  .currentSelect {
    color: white;
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: 700;
  }
  .currentSelectRiver {
    color: white;
    margin-left: 5px;
    font-size: 14px;
  }

  .infoContainer {
    margin: 40px 0 20px 30px;
    color: white;
    .currentRiverName {
      margin-bottom: 20px;
      display: flex;
      .title {
        margin-top: 4px;
      }
      .firstInput {
        color: black;
        margin: 0 10px 0 20px;
        width: 110px;
        height: 25px;
      }
      .secondInput {
        color: black;
        width: 110px;
        height: 25px;
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
      cursor: pointer;
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
