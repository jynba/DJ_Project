<!--
 * @Author: GRIT
 * @Date: 2023-05-15 19:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-28 10:57:00
 * @FilePath: \DJ_Project\dj-project\src\views\main.vue
 * @Description: 
-->
<template>
	<div id="cesiumContainer">
		<loadRiver />
		<panel
			:show-panel="showPanel"
			:has-last="hasLast"
			:form-data="formData"
			@close="handleClosePanel"
			@namedLast="upOneLevel" />
	</div>
	<popup-search id="popup_search" />
</template>
<script setup>
	import { showArea } from '../utils/entity-function/displayArea';
	import loadRiver from '../components/loadRiver.vue';
	import panel from '../components//panel.vue';
	import popupSearch from '../components/popupSearch.vue';
	import request from '../utils/request';
	import { initRiver, debounce } from '@/utils/common.js';
	import { onDeactivated, onMounted, reactive } from 'vue';
	import * as Cesium from 'cesium';
	import { ref } from 'vue';
	import { onActivated } from 'vue';

	/**
	 * 方法名：showPopup
	 * 创建时间：2023/6/21
	 * 作者: 朱海东
	 * 功能：搜索功能
	 *
	 * @returns {Boolean} -
	 */
	const popupShow = ref(true);
	//
	const showPopup = () => {
		popupShow.value = true;
	};

	/**
	 * 方法名：getBoundaryCenter
	 * 创建时间：2023/5/27
	 * 作者: 许佳宇
	 * 功能：计算给定边界的中心点经纬度
	 * @param {Array} boundary - 边界数组，包含多个经纬度坐标点，坐标点以经度、纬度的顺序存储
	 * @returns {Array} - 中心点的经纬度，以经度、纬度的顺序存储
	 */
	const getBoundaryCenter = (boundary) => {
		// 初始化经纬度总和为 0
		let sumLat = 0,
			sumLng = 0;
		// 遍历边界数组，计算经纬度总和
		for (let i = 0; i < boundary.length; i += 2) {
			sumLat += boundary[i + 1];
			sumLng += boundary[i];
		}
		// 计算经纬度平均值，得到中心点经纬度
		const centerLat = sumLat / (boundary.length / 2);
		const centerLng = sumLng / (boundary.length / 2);
		// 返回中心点经纬度数组
		return [centerLng, centerLat];
	};
	/**
	 * 方法名：flyToCenter
	 * 创建时间：2023/05/27
	 * 作者: 许佳宇
	 * 功能：将视角飞到河流范围的中心
	 * @param {Array} data - 边界数组，包含多个经纬度坐标点，坐标点以经度、纬度的顺序存储
	 */
	const flyToCenter = (data) => {
		// 找出边界经纬度中点
		const center = getBoundaryCenter(data.scope);
		const flytoLat = center[0];
		const flytoLng = center[1];

		// 利用经纬度坐标计算边界起点到中点的距离
		const firstLat = data.scope[0];
		const firstLng = data.scope[1];
		const diameter = Math.sqrt(
			Math.pow(firstLat - flytoLat, 2) + Math.pow(firstLng - flytoLng, 2)
		);

		// 将视角飞到边界中点，高度为边界起点到边界中点的距离乘以一个常数17770*3,该常数是多次测试得出的最优值
		window.viewer.camera.flyTo({
			destination: Cesium.Cartesian3.fromDegrees(
				flytoLat,
				flytoLng,
				diameter * 177770 * 4
			),
			orientation: {
				heading: Cesium.Math.toRadians(0),
				pitch: Cesium.Math.toRadians(-90),
				roll: Cesium.Math.toRadians(0),
			},
		});
	};

	/**
	 * 方法名：selectRiver
	 * 创建时间：2023/06/6
	 * 作者: 许佳宇
	 * 功能：点击河流
	 */
	const selectRiver = async (movement) => {
		// 获取全局椭球体
		const ellipsoid = window.viewer.scene.globe.ellipsoid;
		// 拾取鼠标在椭圆上的结束点笛卡尔坐标点
		const cartesian = window.viewer.scene.camera.pickEllipsoid(
			movement.position,
			window.viewer.scene.globe.ellipsoid
		);
		// 笛卡尔坐标转制图坐标
		const cartographic = ellipsoid.cartesianToCartographic(cartesian);
		// 获取点击经纬度高度
		const longitude = Cesium.Math.toDegrees(cartographic.longitude);
		const latitude = Cesium.Math.toDegrees(cartographic.latitude);
		const height = Math.ceil(window.viewer.camera.positionCartographic.height);
		let index;
		if (height > 300000) {
			index = 6;
		}
		if (height < 300000 && height > 200000) {
			index = 5;
		}
		if (height <= 200000 && height > 100000) {
			index = 4;
		}
		if (height <= 150000) {
			index = 3;
		}
		if (height <= 100000) {
			index = 2;
		}
		if (height <= 30000) {
			index = 1;
		}
		console.log(longitude, latitude, height, index, '经纬度高度层级');
		// 发请求
		return request({
			url: '/getriver',
			method: 'post',
			data: {
				lon: longitude,
				lat: latitude,
				index: index,
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		});
	};

	const showPanel = ref(false);
	const hasLast = ref(false);
	const formData = reactive({
		zh_name: '',
		select_river: '',
		averageFlow: '',
		naming_reason: '',
		station_name: '',
		riverCode: '',
		en_name: '',
	});
	const handleClosePanel = () => {
		showPanel.value = false;
	};
	let LINE_SEGMENT_LABELING;

	const showDetail = (data) => {
		return request({
			url: '/getriverlog',
			method: 'POST',
			data: {
				hierarcode: data.hierarcode,
				tablename: 'dongjiang_log', //查询是否已有记录
				basincode: data.basincode,
				regioncode: data.regioncode,
			},
		});
	};

	/**
	 * 方法名：mergeFullName
	 * 创建时间：2023/02/24
	 * 作者: 方序鸿，龙俊良
	 * 功能：命名页面-定位至上一级
	 * @param {Object} CHAINED_TEXT - 传入的完整的链式字符串
	 * 返回：返回为以-链接的字符串
	 */
	const mergeFullName = (CHAINED_TEXT) => {
		// 设置合并的数组
		let mergeList = [];
		// 分割链式结构字符串
		let splitList = CHAINED_TEXT.split('-');
		mergeList.push(splitList[0]);
		// 遍历数组,如果合并的数组中不存在,则添加河段名,避免重复
		splitList.forEach((e) => {
			if (mergeList.indexOf(e) == -1) {
				mergeList.push(e);
			}
		});
		// 用于渲染前端链式的字符串
		let fullName = '';
		// 遍历合并后的数组
		mergeList.forEach((e) => {
			fullName += e + '-';
		});
		// 将最后的-给去掉
		fullName = fullName.slice(0, -1);
		return fullName;
	};

	// 展示面板
	const publicApi = async (data) => {
		formData.select_river = ''; //清空链式名字

		// 存放hierarcode截取后的数据 记录上一级的hcode
		let hierarcodeList = [];
		// 计算hierarcode有多少层,通过这个可以判断当前河流是否命名.每2位截取一次
		for (let i = 0; i < data.hierarcode.length; i = i + 2) {
			hierarcodeList.push(data.hierarcode.slice(i, i + 2));
		}
		// console.log(hierarcodeList);

		// console.log(data, 'getriver');
		// 查找河流在日志表中存在的数据
		const riverLogArray = await showDetail(data);
		// console.log(riverLogArray);

		if (riverLogArray.length == 0 && hierarcodeList.length == 1) {
			hasLast.value = false;
			formData.zh_name = '未命名';
			// 说明没有链式结构的河流,为干流
			formData.select_river = '';
		}
		// 否则则会进行判断
		else {
			// 如果查询得到的数组长度+1等于当前河流的分割长度的话,说明当前河流没有命名
			if (
				riverLogArray.length !== hierarcodeList.length &&
				riverLogArray.length + 1 == hierarcodeList.length
			) {
				hasLast.value = false;
				// 遍历返回的结果
				riverLogArray.map((v, i) => {
					const { rivername } = v;
					// 判断河流名称是否存在-符号
					let riverFullName =
						rivername.indexOf('-') == -1
							? rivername
							: rivername.replace('-', '@');
					// 如果遍历到最后一个,则不需要添加-
					if (i == riverLogArray.length - 1) {
						formData.select_river += riverFullName;
					}
					// 否则就需要在两个名称中间添加-
					else if (i != riverLogArray.length - 1) {
						formData.select_river += riverFullName + '-';
					}
					console.log(formData.select_river, 'select');
					// 为河段名添加未命名
					formData.zh_name = '未命名';
				});
				// 获取合并后的链式字符串
				let beforeFull = mergeFullName(formData.select_river);
				// 替换可能存在的@符合
				// textValue.innerHTML = beforeFull.replace("@", "-");
			}
			//  如果返回的结果与code长度一致,说明已经命好名了
			else if (riverLogArray.length == hierarcodeList.length) {
				hasLast.value = false;

				// 继续遍历返回的结果
				riverLogArray.map((v, i) => {
					const {
						rivername,
						// shuilicode,
						// source,
						// discharge,
						// englishname,
						// staionname,
					} = v;
					// 判断河流名称是否存在-符号
					let rivernames =
						rivername.indexOf('-') == -1
							? rivername
							: rivername.replace('-', '@');
					// 倒数第二个河流名不需要添加-
					if (i == riverLogArray.length - 2) {
						formData.select_river += rivernames;
					}
					// 倒数第二个往前都需要添加
					else if (
						i != riverLogArray.length - 2 &&
						i != riverLogArray.length - 1
					) {
						formData.select_river += rivernames + '-';
					}
					// 当为最后一个时,说明为当前点击的河流名称
					else if (i == riverLogArray.length - 1) {
						// 往输入框添加最后的河流名称
						formData.zh_name = rivername;

						// 在选择列表中，找到当前命名依据所对应的value值
						// const flags = SELECT_LIST.find((v) => v.text == source);
						// // 如果能找到，说明在0-5之间
						// if (flags) {
						//   NAMING_REASON.value = flags.value;
						//   // 否则则说明是6，需要添加输入框，并将内容填入
						// } else {
						//   NAMING_REASON.value = "6";
						//   // 创建输入框元素
						//   let textArea = document.createElement("input");
						//   // 设置id
						//   textArea.setAttribute("id", "basisValue");
						//   // 在命名依据选项框后面添加
						//   document.getElementById("selectValue").after(textArea);
						//   let basisValue = document.getElementById("basisValue");
						//   basisValue.value = source;
						// }
						// 添加中国河流代码
						// CHINESE_RIVER_CODE.value = shuilicode;
						// 添加平均流量信息
						// AVERAGE_FLOW.value = discharge;
						// 添加水文站信息
						// document.getElementById("panel2Input5").value = staionname;
					}
				});
			} else {
				// 否则说明上一级河流也未命名
				hasLast.value = true;
				formData.zh_name = '未命名';
				upOneLevel = () => {
					flytoLastRiverLocation(data);
				};
			}
		}
		showPanel.value = true; //展示面板
	};

	//找到上一级河流
	let upOneLevel;
	const flytoLastRiverLocation = async (riverdata) => {
		formData.select_river = '';
		delete riverdata.scope;
		const res = await request({
			url: '/getLastRiverLocation',
			method: 'post',
			data: {
				...riverdata,
			},
		}); //找上一级河流位置
		// console.log(res, 'res');
		const res2 = await request({
			url: '/getRiverGeom',
			method: 'post',
			data: res[0],
		}); //高亮上一级河流
		// console.log(res2, 'res2');
		window.$selectedRiver = res2; //把选中命名的河流挂载到window
		flyToCenter(res2);
		// 飞行到河段的位置
		//重置面板显示
		showPanel.value = false;
		// 找不到上一级河流
		if (typeof res2 == 'string') {
			//隐藏高亮
			window.viewer.entities.remove(LINE_SEGMENT_LABELING);
		} else {
			//面板跟随显示
			//隐藏高亮river
			window.viewer.entities.remove(LINE_SEGMENT_LABELING);
			//创建实体用于点击河段时高亮该河段
			let addRedLine = window.viewer.entities.add({
				name: 'Red line on the surface',
				polyline: {
					positions: Cesium.Cartesian3.fromDegreesArray(res2.scope),
					followSurface: false,
					width: 7,
					material: new Cesium.PolylineOutlineMaterialProperty({
						color: Cesium.Color.ORANGE,
						outlineWidth: 7,
						outlineColor: Cesium.Color.RED,
					}),
					depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
						color: Cesium.Color.RED,
						outlineWidth: 7,
						outlineColor: Cesium.Color.RED,
					}),
				},
			});
			LINE_SEGMENT_LABELING = addRedLine;
			publicApi(res[0]);
		}
	};

	/**
	 * 方法名：clickRightMouseFunction
	 * 创建时间：2023/05/27
	 * 作者: 许佳宇
	 * 功能：监听右键的事件
	 */
	const clickRightMouseFunction = () => {
		let handler = new Cesium.ScreenSpaceEventHandler(
			window.viewer.scene.canvas
		);
		handler.setInputAction(function (movement) {
			debounce(async function () {
				window.viewer.entities.remove(LINE_SEGMENT_LABELING);
				const res = await selectRiver(movement);
				console.log(res);

				// 先清除高亮
				if (res.code == 20000) {
					hasLast.value = false;
					// 再将视角转到河流中心
					flyToCenter(res.data);
					// 在地球上添加高亮显示当前河流
					window.$selectedRiver = res.data; //把选中命名的河流挂载到window
					let addRedLine = window.viewer.entities.add({
						name: 'Red line on the surface',
						polyline: {
							positions: Cesium.Cartesian3.fromDegreesArray(res.data.scope), //经纬度数组 data.scope
							followSurface: false,
							width: 4,
							material: new Cesium.PolylineOutlineMaterialProperty({
								color: Cesium.Color.RED,
								outlineWidth: 2,
								outlineColor: Cesium.Color.RED,
							}),
							depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
								color: Cesium.Color.RED,
								outlineWidth: 2,
								outlineColor: Cesium.Color.RED,
							}),
						},
					});
					LINE_SEGMENT_LABELING = addRedLine;

					publicApi(res.data);
				}
			}, 500)();
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	};

	// 左键点击高亮
	const clickLeftMouseFunction = () => {
		let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

		handler.setInputAction(function (movement) {
			debounce(async function () {
				window.viewer.entities.remove(LINE_SEGMENT_LABELING);
				const res = await selectRiver(movement);
				console.log(res);
				if (res.code == 20000) {
					// 再将视角转到河流中心
					flyToCenter(res.data);
					// 在地球上添加高亮显示当前河流
					window.$selectedRiver = res.data; //把选中命名的河流挂载到window
					let addRedLine = window.viewer.entities.add({
						name: 'Red line on the surface',
						polyline: {
							positions: Cesium.Cartesian3.fromDegreesArray(res.data.scope), //经纬度数组 data.scope
							followSurface: false,
							width: 4,
							material: new Cesium.PolylineOutlineMaterialProperty({
								color: Cesium.Color.RED,
								outlineWidth: 2,
								outlineColor: Cesium.Color.RED,
							}),
							depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
								color: Cesium.Color.RED,
								outlineWidth: 2,
								outlineColor: Cesium.Color.RED,
							}),
						},
					});
					console.log(addRedLine);
					LINE_SEGMENT_LABELING = addRedLine;
				}
			}, 500)();
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	};

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
		const token = 'a5ef217ac65d9c8323d15a22f98c5c66';
		const imgLayer = new Cesium.WebMapTileServiceImageryProvider({
			url:
				'http://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
				'&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
				`&style=default&format=tiles&tk=${token}`,
			layer: 'tdtCva',
			style: 'default',
			format: 'tiles',
			tileMatrixSetID: 'c',
			subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
			tilingScheme: new Cesium.GeographicTilingScheme(),
			tileMatrixLabels: [
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'10',
				'11',
				'12',
				'13',
				'14',
				'15',
				'16',
				'17',
				'18',
				'19',
			],
			// maximumLevel: 18,
			show: false,
		});
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
		viewer.imageryLayers.addImageryProvider(imgLayer);
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

		viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200; //相机最小缩放距离
		initRiver(); //分层级加载河流
		clickLeftMouseFunction();
		clickRightMouseFunction();
		showArea();
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

	#popup_search {
		position: fixed;
		bottom: 3.125rem;
		width: 100%;
		height: 3.125rem;
	}
</style>
