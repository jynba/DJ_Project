<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-07-13 15:21:15
 * @LastEditTime: 2023-07-14 14:38:23
-->
<!--
 * @Descripttion: 柱状图组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-07-13 15:21:15
 * @LastEditTime: 2023-07-14 09:17:39
-->

<template>
  <div>
    <div id="dropYear">
      <van-dropdown-menu :overlay="false">
        <van-dropdown-item
          v-model="currentYearSelected"
          :options="yearOption"
          @change="handleYearChange"
        />
      </van-dropdown-menu>
    </div>

    <div class="histogram" ref="histgramChart"></div>
    <div class="histogram" ref="stackedChart"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";
import yearWaterData from "../data/waterData";
import precipData from "../data/precipData";
onMounted(() => {
  //柱状图
  initHistogramChart();
  //堆叠柱状图
  initStackedHistogramChart();
  //展示第一个数据
  handleYearChange(0);
});

/**
 * @Author: 朱海东
 * @Date: 2023-07-13 15:27:47
 * @name: initChart
 * @msg: 初始化柱状图
 * @return {*}
 */
let histgramChartSeries = reactive({
  series: precipData[0].series,
});
const histgramChart = ref(null);
const initHistogramChart = () => {
  const chartElement = histgramChart.value;
  const histChart = echarts.init(chartElement);

  const options = {
    color: ["#499fff", "#ffa841", "#5dd98c"],
    title: {
      text: "降水量(mm)",
      left: 0,
      top: 10,
      textStyle: {
        color: "#666",
        fontSize: 18,
      },
    },
    grid: {
      top: 80,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        crossStyle: {
          color: "#999",
        },
      },
    },
    // legend: {
    //   bottom: 0,
    //   itemWidth: 30,
    //   itemHeight: 11,
    //   itemGap: 20,
    //   data: ["2021年降水量", "与上年比较(%)", "与常年比较(%)"],
    // },
    xAxis: [
      {
        type: "category",
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: "#e9e9e9",
          },
        },
        axisLabel: {
          color: "#999",
        },
        data: ["东莞", "河源", "惠州", "深圳", "广州", "韶关", "梅州"],
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        // name: "降水量(mm)",
        min: 0,
        interval: 500,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: "#e9e9e9",
          },
        },
        axisLabel: {
          color: "#999",
          // formatter: '{value} %'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#efeff0",
            width: 1,
            type: "dashed",
          },
        },
      },
      {
        type: "value",
        show: false,
        name: "变化量",
        min: -45,
        interval: 10,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: "#e9e9e9",
          },
        },
        axisLabel: {
          color: "#999",
          formatter: "-{value} %",
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: "#efeff0",
            width: 1,
            type: "dashed",
          },
        },
      },
    ],
    series: histgramChartSeries.series,
  };

  histChart.setOption(options);
};

/**
 * @Author: 朱海东
 * @Date: 2023-07-14 09:18:21
 * @name:
 * @msg:
 * @return {*}
 */
const stackedChart = ref(null);
let stackedChartSeries = reactive({
  series: yearWaterData[0].series,
});
const initStackedHistogramChart = () => {
  const stackedElement = stackedChart.value;
  const StackedChart = echarts.init(stackedElement);

  let optionThree = {
    color: ["#ffea00", "#26c6da", "#e53935", "#00e676", "#1976d2"],
    title: {
      text: "用水量(亿m³)",
      left: 0,
      top: 10,
      textStyle: {
        color: "#666",
        fontSize: 18,
      },
    },
    grid: {
      top: 80,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        crossStyle: {
          color: "#999",
        },
      },
    },
    // legend: {
    //   bottom: 0,
    //   itemWidth: 30,
    //   itemHeight: 11,
    //   itemGap: 20,
    //   data: ["农业", "工业", "城镇公共", "居民生活", "生态环境"],
    // },
    xAxis: [
      {
        type: "category",
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: "#e9e9e9",
          },
        },
        axisLabel: {
          color: "#999",
        },
        data: ["东莞", "河源", "惠州", "深圳", "广州", "韶关", "梅州"],
        axisPointer: {
          type: "shadow",
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        min: 0,
        // interval: 20,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: "#e9e9e9",
          },
        },
        axisLabel: {
          color: "#999",
          // formatter: '{value} %'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#efeff0",
            width: 1,
            type: "dashed",
          },
        },
      },
    ],
    series: stackedChartSeries.series,
  };

  StackedChart.setOption(optionThree);
};

/**
 * @Author: 朱海东
 * @Date: 2023-07-14 09:40:18
 * @name:
 * @msg: 年份切换
 * @return {*}
 */
const currentYearSelected = ref(0);
const yearOption = [
  { text: 2021, value: 0 },
  { text: 2020, value: 1 },
  { text: 2019, value: 2 },
  { text: 2018, value: 3 },
  { text: 2017, value: 4 },
];

const handleYearChange = (val) => {
  //筛选用水量数据
  let yearWaterArr1 = precipData.find((i, index) => {
    return index == val;
  });
  histgramChartSeries.series = yearWaterArr1.series;

  //筛选用水量数据
  let yearWaterArr2 = yearWaterData.find((i, index) => {
    return index == val;
  });
  stackedChartSeries.series = yearWaterArr2.series;
  //刷新图表
  initHistogramChart();
  initStackedHistogramChart();
};
</script>

<style lang="scss" scoped>
.histogram {
  width: 100%;
  height: 17rem;
}
// .van-dropdown-menu {
//   .van-dropdown-menu__bar {
//     background-color: gray;
//   }
// }
#dropYear {
  width: 30%;
  height: 2rem;
  .van-dropdown-menu__bar {
    box-shadow: none;
  }
}
</style>
