const precipData = [
  {
    year: 2021,
    series: [
      {
        name: "2021年降水量",
        type: "bar",
        barWidth: "20",
        data: [1438.9, 1153.2, 1326.3, 1448.4, 1392.5, 1545.7, 1067.7],
      },
      {
        name: "与上年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [-14.6, -17.8, -18.9, -9.2, -23.2, -15.6, -12.3],
      },
      {
        name: "与常年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [0.7, -32, -29.7, -26.2, -25.5, -9.7, -34.3],
      },
    ],
  },
  {
    year: 2020,
    series: [
      {
        name: "2020年降水量",
        type: "bar",
        barWidth: "20",
        data: [1685.2, 1403.3, 1636.1, 1596, 1812.7, 1831.7, 1217.1],
      },
      {
        name: "与上年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [-10.1, -32.2, -26.4, -16.8, -21.4, -10.9, -31.6],
      },
      {
        name: "与常年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [1.3, -17.3, -13.4, -18.1, -1.8, 8.9, -24.7],
      },
    ],
  },
  {
    year: 2019,
    series: [
      {
        name: "2019年降水量",
        type: "bar",
        barWidth: "20",
        data: [1875.3, 2068.5, 2222.9, 1918.2, 2306.3, 2056.6, 1779.2],
      },
      {
        name: "与上年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [7.1, 40.6, 15.9, -9.5, 26.7, 25.6, 33],
      },
      {
        name: "与常年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [12.7, 21.9, 17.7, -1.5, 25, 22.3, 10.1],
      },
    ],
  },
  {
    year: 2018,
    series: [
      {
        name: "2018年降水量",
        type: "bar",
        barWidth: "20",
        data: [1750.4, 1471.2, 1918.4, 2118.5, 1820.7, 1636.9, 1337.4],
      },
      {
        name: "与上年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [7.0, 1.3, 4.9, 14.1, -1.4, 0.02, -7.2],
      },
      {
        name: "与常年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [5.2, -13.3, 1.5, 8.8, -1.3, -2.7, -17.2],
      },
    ],
  },
  {
    year: 2017,
    series: [
      {
        name: "2017年降水量",
        type: "bar",
        barWidth: "20",
        data: [1635.5, 1452.8, 1828.2, 1789.2, 1846.9, 1636.5, 1440.6],
      },
      {
        name: "与上年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [-33.3, -41.4, -32.5, -33.8, -24.6, -29.5, -43.6],
      },
      {
        name: "与常年比较(%)",
        type: "line",
        yAxisIndex: 1,
        data: [-1.7, -14.4, -3.2, -6.1, 0.1, -2.7, -10.9],
      },
    ],
  },
];

export default precipData;
