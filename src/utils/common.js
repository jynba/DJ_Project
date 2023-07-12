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
			show: false
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
	DONGJIANG_RIVERS.forEach((item, index) => {
		if (index == 0) return;
		item.show = false
	})
	// 获取图层索引，通过show显示与隐藏
	DONGJIANG_RIVERS[river_index].show = isShow;
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

	for (let index = 1; index < DONGJIANG_RIVERS.length; index++) {
		DONGJIANG_RIVERS[index] = addWebMapData(
			IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
			`dongjiang:dongjiang_river${index}`
		);
		DONGJIANG_RIVERS[index].show = false
	}


	// 默认显示3级河流
	let showRiver7 = layerShow(7, true);
	let showRiver6
	let showRiver5
	let showRiver4;
	let showRiver3;
	let showRiver2;
	let showRiver1;
	// const dongjiangbound6 = addWebMapData(
	// 	IP_ADDRESS_WMS1 + 'geoserver/dongjiang/wms',
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
		if (height >= 600000 && height < 680000) {
			showRiver6 = layerShow(6)
		}
		else if (height >= 350000 && height < 600000) {
			showRiver5 = layerShow(5)
		} else if (height > 200000 && height < 350000) {
			showRiver4 = layerShow(4);

		} else if (height <= 200000 && height > 100000) {
			showRiver3 = layerShow(3);

		} else if (height <= 100000 && height > 30000) {
			showRiver2 = layerShow(2);
		} else if (height <= 30000) {
			showRiver1 = layerShow(1);
		} else {
			showRiver7 = layerShow(7)
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
