/**文件注释
 * 版本号：
 * 创建时间：2023/05/17
 * 作者: 许佳宇
 * 用途：公共类函数
 */

/**
 * 作者 许佳宇
 * 创建时间：2023/05/17
 * 方法：addWebMapData
 * 功能：向 Cesium 地球上添加 WebMap 服务。
 * 用法：
 * @param {string} url - WebMap 服务地址。
 * @param {string} layers - 图层名称。
 * @return {ImageryLayer} - 返回一个 Cesium ImageryLayer 对象。
 */
export function addWebMapData(url, layers) {
	return window.viewer.imageryLayers.addImageryProvider(
		new Cesium.WebMapServiceImageryProvider({
			url: url,
			layers: layers,
			alpha: 0,
			parameters: {
				service: 'WMS',
				format: 'image/png',
				transparent: true,
			},
		})
	);
}

/**
 * 方法名：layerShow
 * 作者： 许佳宇
 * 创建时间：2023/05/31
 * 功能：控制河流层级的显示
 */
let DONGJIANG_RIVERS = [, -1, -1, -1, -1, -1, -1, -1];
export function layerShow(river_index, isShow = true) {
	// 获取图层索引，通过show显示与隐藏
	const layer_index = window.viewer.imageryLayers.indexOf(
		DONGJIANG_RIVERS[river_index]
	);

	if (layer_index == -1) {
		// 天地图标注
		DONGJIANG_RIVERS[river_index] = addWebMapData(
			IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
			`dongjiang:dongjiang_river${river_index}`
		);
	} else {
		window.viewer.imageryLayers.get(layer_index).show = isShow;
	}
}
/**
 * 变量名：initReservoirs
 * 作者： 许佳宇
 * 创建时间：2023/05/31
 * 功能：初始化河流
 */
let DONGJIANG_RESERVOIRS;
export function initReservoirs() {
	const layer_index = window.viewer.imageryLayers.indexOf(DONGJIANG_RESERVOIRS);
	if (layer_index == -1) {
		DONGJIANG_RESERVOIRS = addWebMapData(
			IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
			'dongjiang:dongjiang_reservoirs_total'
		);
	} else {
		window.viewer.imageryLayers.get(layer_index).show =
			!window.viewer.imageryLayers.get(layer_index).show;
	}
}

/**
 * 变量名：initRiver
 * 作者： 许佳宇
 * 创建时间：2023/05/26
 * 功能：初始化河流
 */
export function initRiver() {
	// 默认显示3级河流
	const showRiver5 = layerShow(5);
	let showRiver4;
	let showRiver3;
	let showRiver2;
	let showRiver1;
	// const dongjiangbound6 = addWebMapData(
	// 	IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
	// 	'dongjiang:dongjiang_bound6'
	// );

	// 回归中心位置
	window.viewer.scene.camera.changed.addEventListener(function () {
		// 加载河网和固定位置
		let height = Math.ceil(window.viewer.camera.positionCartographic.height);
		//获取屏幕中心经纬度
		let centerResult = window.viewer.camera.pickEllipsoid(
			new Cesium.Cartesian2(
				window.viewer.canvas.clientWidth / 2,
				window.viewer.canvas.clientHeight / 2
			)
		);
		let curPosition =
			Cesium.Ellipsoid.WGS84.cartesianToCartographic(centerResult);
		let longitude = (curPosition.longitude * 180) / Math.PI;
		let latitude = (curPosition.latitude * 180) / Math.PI;
		// 限制高度，到达一定高度，则回归
		if (height > 620256) {
			debounce(function () {
				window.viewer.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(
						114.50734815163804,
						23.76178676036698,
						751048
					),
					duration: 0.5,
				});
			}, 500)();
		}
		if (height > 200000 && height < 300000) {
			showRiver4 = layerShow(4);
			showRiver3 = layerShow(3, false);
			showRiver2 = layerShow(2, false);
			showRiver1 = layerShow(1, false);
		} else if (height <= 200000 && height > 100000) {
			showRiver3 = layerShow(3);
			showRiver2 = layerShow(2, false);
			showRiver1 = layerShow(1, false);
		} else if (height <= 100000 && height > 30000) {
			showRiver2 = layerShow(2);
			showRiver1 = layerShow(1, false);
		} else if (height <= 30000) {
			showRiver1 = layerShow(1);
		} else {
			showRiver1 = layerShow(1, false);
			showRiver2 = layerShow(2, false);
			showRiver3 = layerShow(3, false);
			showRiver4 = layerShow(4, false);
		}
	});
}

/**
 * 方法名：mapLabels
 * 作者： 许佳宇
 * 创建时间：2023/05/26
 * 功能：天地图标注
 */
let MAP_LABELS = '';
export function mapLabels() {
	// 获取图层索引，通过show显示与隐藏
	const layer_index = window.viewer.imageryLayers.indexOf(MAP_LABELS);
	if (layer_index == -1) {
		// 天地图标注
		MAP_LABELS = window.viewer.imageryLayers.addImageryProvider(
			new Cesium.WebMapTileServiceImageryProvider({
				url:
					'http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0' +
					'&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}' +
					'&style=default&format=tiles&tk=a5ef217ac65d9c8323d15a22f98c5c66',
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
				maximumLevel: 18,
			})
			// 1 //添加到底部
		);
	} else {
		window.viewer.imageryLayers.get(layer_index).show =
			!window.viewer.imageryLayers.get(layer_index).show;
	}
}

/**
 * 方法名：flytoLastRiverLocation
 * 创建时间：2023/02/24
 * 作者: 方序鸿
 * 功能：命名页面-定位至上一级
 * @param {Object} riverdata - 接口返回的河段信息
 */

function flytoLastRiverLocation(riverdata) {
	const tmp = { ...riverdata };
	CHAINED_TEXT = '';
	try {
		// 打开河段加载提示框
		$.ajax({
			url: IP_ADDRESS_WEB + 'getLastRiverLocation',
			method: 'POST',
			data: {
				...tmp,
			},
			success: function (res) {
				if (res == 'error') {
					// 查询失败
					closeLoadingRiver(); // 关闭河段加载提示框
					alert('查询失败');
					document.getElementById('panel2').style.display = 'none'; // 隐藏table
				} else {
					// 查询成功
					try {
						const tmp2 = { ...res[0] };
						// 高度值列表
						let heightist = [
							0, 10000, 15000, 33000, 54934, 104934, 204934, 439163, 1276504,
							3316747, 5396496, 7053467, 9947664,
						];
						var flytolon = parseFloat(res[0].outletx); // 经度
						var flytolat = parseFloat(res[0].outlety); // 纬度
						var flytoheight = heightist[res[0].level]; // 高度

						$.ajax({
							url: IP_ADDRESS_WEB + 'getRiverGeom',
							data: {
								...tmp2,
							},
							method: 'POST',
							success: function (data) {
								// 飞行到河段的位置
								viewer.camera.flyTo({
									destination: Cesium.Cartesian3.fromDegrees(
										flytolon,
										flytolat,
										flytoheight
									),
									orientation: {
										heading: Cesium.Math.toRadians(0),
										pitch: Cesium.Math.toRadians(-90),
										roll: Cesium.Math.toRadians(0),
									},
								});
								//隐藏table
								document.getElementById('panel2').style.display = 'none';

								if (typeof data == 'string') {
									//隐藏table
									document.getElementById('panel2').style.display = 'none';
									//隐藏高亮
									viewer.entities.remove(getBLUE_LINE());
								} else {
									// // 面板跟随显示
									removeRiverNameForm();
									setDomStyle();
									DATA_DETAIL = data;
									document
										.getElementById('submits')
										.removeAttribute('disabled');
									// 将结果传入该函数进行处理
									publicApi(data);
									//隐藏高亮river
									viewer.entities.remove(getBLUE_LINE());
									dataCode = data.scope;
									//创建实体用于点击河段时高亮该河段
									setBLUE_LINE(
										viewer.entities.add({
											name: 'Red line on the surface',
											polyline: {
												positions: Cesium.Cartesian3.fromDegreesArray(
													data.scope
												),
												followSurface: false,
												width: 7,
												material: new Cesium.PolylineOutlineMaterialProperty({
													color: Cesium.Color.ORANGE,
													outlineWidth: 7,
													outlineColor: Cesium.Color.RED,
												}),
												depthFailMaterial:
													new Cesium.PolylineOutlineMaterialProperty({
														color: Cesium.Color.RED,
														outlineWidth: 7,
														outlineColor: Cesium.Color.RED,
													}),
											},
										})
									);
								}
							},
							error: function (err) {
								closeLoadingRiver();
							},
						});
					} catch {
						closeLoadingRiver();
						console.log('getLastRiverLocation2 ajax err');
					}
				}
			},
			error: function (err) {
				closeLoadingRiver();
				console.log('ajax err', err);
			},
		});
	} catch {
		closeLoadingRiver();
		console.log('getLastRiverLocation ajax err');
	}
}

/**
 * 创建时间：2023/05/22
 * 作者: 许佳宇
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
let timeout;
export function debounce(func, wait, immediate = true) {
	return function () {
		if (timeout) clearTimeout(timeout);
		if (immediate) {
			var callNow = !timeout;
			timeout = setTimeout(() => {
				timeout = null;
			}, wait);
			if (callNow) func.apply(this, arguments);
		} else {
			timeout = setTimeout(function () {
				func.apply(context, args);
			}, wait);
		}
	};
}
