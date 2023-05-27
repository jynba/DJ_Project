<!--
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: GRIT
 * @LastEditTime: 2023-05-21 15:15:49
 * @FilePath: \DJ_Project\dj-project\src\views\main.vue
 * @Description: 
-->
<template>
	<div id="cesiumContainer">
		<loadRiver />
		<panel />
	</div>
</template>
<script setup>
	import loadRiver from './loadRiver.vue';
	import panel from './panel.vue';
	import { initRiver, clickLeftMouseFunction } from '@/utils/common.js';
	import { onMounted } from 'vue';
	import * as Cesium from 'cesium';
	onMounted(() => {
		const config = {
			showRenderLoopErrors: false, //如果为true，则在发生渲染循环错误时，此小部件将自动向包含错误的用户显示HTML面板。
			requestRenderMode: true, // 开启请求的渲染模式
			maximumRenderTimeChange: Infinity, // 处理模拟时间改变
			animation: false, // 是否创建动画小器件，左下角仪表
			baseLayerPicker: false, // 是否显示图层选择器
			fullscreenButton: false, // 是否显示全屏按钮
			geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
			homeButton: false, // 是否显示Home按钮
			infoBox: false, // 是否显示信息框
			shouldAnimate: true, // 允许动画
			sceneModePicker: false, // 是否显示3D/2D选择器
			selectionIndicator: false, // 是否显示选取指示器组件鼠标绿色框
			timeline: false, // 是否显示时间轴
			navigationHelpButton: false, // 是否显示右上角的帮助按钮
			vrButton: false, // 是否显示双屏
			scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
			fullscreenElement: document.body, // 全屏时渲染的HTML元素
			orderIndependentTranslucency: false,
			navigationInstructionsInitiallyVisible: false,
			// terrainProvider: Cesium.createWorldTerrainAsync({
			// 	requestWaterMask: true, // 请求水体效果所需要的海岸线数据
			// 	requestVertexNormals: true, // 请求地形照明数据
			// }),
		};
		const viewer = new Cesium.Viewer('cesiumContainer', config);

		viewer.scene.debugShowFramesPerSecond = true; //不显示帧率
		viewer.shadows = true; //开启或关闭阴影
		// 关闭抗锯齿
		viewer.scene.fxaa = true;
		viewer.scene.postProcessStages.fxaa.enabled = true;
		//帧率检测
		viewer.scene.debugShowFramesPerSecond = false;
		//全球光照
		viewer.scene.globe.enableLighting = false;
		//更改配置，性能优化
		viewer.scene.logarithmicDepthBuffer = true;
		// 取消双击事件-追踪该位置
		viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
			Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
		);

		// 去除版权信息
		viewer._cesiumWidget._creditContainer.style.display = 'none';

		// 设置进入平台的初始视角为东江流域
		viewer.camera.setView({
			// 笛卡尔坐标(经度,维度,高度)
			// 青藏高原
			// destination: Cesium.Cartesian3.fromDegrees(
			// 	91.18722472152372,
			// 	33.65117237315499,
			// 	2999362
			// ),
			//东江流域
			destination: Cesium.Cartesian3.fromDegrees(
				114.72537169973519,
				23.924765567670345,
				628624
			),
			orientation: {
				heading: Cesium.Math.toRadians(360), //方向
				pitch: Cesium.Math.toRadians(-90), //俯仰角
				roll: Cesium.Math.toRadians(0),
			},
		});

		// 将viewer挂载到window上
		window.viewer = viewer;
		window.Cesium = Cesium;

		// 天地图
		// const token = 'a5ef217ac65d9c8323d15a22f98c5c66';
		// const imgLayer = new Cesium.WebMapTileServiceImageryProvider({
		// 	url: `https://t0.tianditu.gov.cn/img_w/wmts?tk=${token}`,
		// 	format: 'tiles',
		// 	layer: 'img',
		// 	style: 'default',
		// 	tileMatrixSetID: 'w',
		// });
		// const ciaLayer = new Cesium.WebMapTileServiceImageryProvider({
		// 	url: `https://t0.tianditu.gov.cn/cia_w/wmts?tk=${token}`,
		// 	format: 'tiles',
		// 	layer: 'cia',
		// 	style: 'default',
		// 	tileMatrixSetID: 'w',
		// });
		// const dongjiangbound = new Cesium.WebMapServiceImageryProvider({
		// 	url: IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
		// 	layers: 'dongjiang:dongjiang_bound7',
		// 	parameters: {
		// 		service: 'WMS',
		// 		format: 'image/png',
		// 		transparent: true,
		// 	},
		// });
		// viewer.imageryLayers.addImageryProvider(imgLayer);
		// viewer.imageryLayers.addImageryProvider(ciaLayer);

		// 设置建筑
		// const city = viewer.scene.primitives.add(
		// 	new Cesium.Cesium3DTileset({ url: Cesium.IonResource.fromAssetId(3839) })
		// );

		// 定义3d样式
		// const heightStyle = new Cesium.Cesium3DTileStyle({
		// 	color: {
		// 		//条件判断具体颜色
		// 		conditions: [
		// 			[`$(height)>=300`, 'rgba(45,0,75,0.5)'],
		// 			[`$(height)>=200`, 'rgb(102,71,151)'],
		// 			[`$(height)>=100`, 'rgba(45,0,75,0.5)'],
		// 			[`$(height)>=50`, 'rgba(45,0,75,0.5)'],
		// 			[`$(height)>=25`, 'rgba(45,0,75,0.5)'],
		// 			[`$(height)>=10`, 'rgba(45,0,75,0.5)'],
		// 			[`$(height)>=5`, 'rgba(45,0,75,0.5)'],
		// 			['true', 'rgba(127,59,8'],
		// 		],
		// 	},
		// });
		// city.style = heightStyle;

		// initRiver();
		// 分区分块加载河流影像
		// viewer.scene.camera.moveStart.addEventListener(function () {

		// });
		initRiver();
		clickLeftMouseFunction();
	});
</script>
<style lang="scss">
	#cesiumContainer {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
