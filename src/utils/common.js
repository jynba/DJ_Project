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
 * 变量名：layerShow
 * 作者： 许佳宇
 * 创建时间：2023/05/18
 * 功能：控制显示图层的状态
 * @param {Boolean} stat - 图层初始的显示状态，true为显示，false为不显示
 * @param {Boolean} changStat - 图层要改变的状态，true为显示，false为不显示
 * @param {object} obj - 要控制的图层对象
 */
export let layerShow = function (stat, obj) {
	if (stat == false) {
		// 图层的显示状态为false，图层的透明度设为0
		obj.alpha = 0;
	} else {
		// 图层的显示状态为true，图层的透明度设为1
		obj.alpha = 1;
	}

	this.show = function (changStat) {
		if (changStat == true) {
			// 图层的显示状态为true，图层的透明度设为1
			obj.alpha = 1;
		} else {
			// 图层的显示状态为false，图层的透明度设为0
			obj.alpha = 0;
		}
	};
};

export function initRiver() {
	// 加载geoserver服务
	// const dongjiangbound7 = addWebMapData(
	// 	IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
	// 	'dongjiang:dongjiang_bound7'
	// );
	// const dongjiangriver7 = addWebMapData(
	// 	IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
	// 	'dongjiang:dongjiang_river7'
	// );
	const dongjiangbound6 = addWebMapData(
		IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
		'dongjiang:dongjiang_bound6'
	);
	const dongjiangriver6 = addWebMapData(
		IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
		'dongjiang:dongjiang_river6'
	);
	// const dongjiangReservoirs = addWebMapData(
	// 	IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
	// 	'dongjiang:dongjiang_reservoirs_total'
	// );
	// 天地图标注
	window.viewer.imageryLayers.addImageryProvider(
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
			show: false,
		})
	);
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
		// if (latitude > 120 || latitude < 100 || longitude < 20 || longitude > 30) {
		// 	console.log(longitude, latitude, height);
		// 	setTimeout(() => {
		// 		window.viewer.camera.flyTo({
		// 			destination: Cesium.Cartesian3.fromDegrees(
		// 				114.50734815163804,
		// 				23.76178676036698,
		// 				751048
		// 			),
		// 			duration: 0.5,
		// 		});
		// 	}, 2000);
		// }
	});
}

// 用于给河流画线
let LINE_SEGMENT_LABELING;

/**
 * 方法名：setLine
 * 创建时间：2023/05/22
 * 作者: 许佳宇
 * 功能：设置修改LINE_SEGMENT_LABELING的函数
 */
export function setLine(value) {
	LINE_SEGMENT_LABELING = value;
}

export function clickRiver() {
	$.ajax({
		url: IP_ADDRESS_WEB + 'getTibetDetail1',
		method: 'POST',
		data: {
			// 河流或湖泊名
			name,
			gid,
			// 类型，lake或river
			type,
			// 当前用户的权限
			authority,
		},
		success: function (res) {
			// 返回的结果含有河段信息
			if (res.code == 20000) {
				if (document.getElementById('drop')) {
					document.getElementById('drop').innerHTML = '';
				}
				// 清除按钮样式
				// setBtnStyle();
				document.getElementById('searchinput').value = '';
				// 如果为河流类型
				if (type == 'river') {
					// 先清除高亮
					viewer.entities.remove(LINE_SEGMENT_LABELING);
					// 再将视角转到河流中心
					flyToCenter(res.data, 1);

					// 用于调用获取显示图表
					judgmentType(res.data.gid, 'river');
					// 在地球上添加高亮显示当前河流
					let addRedLine = viewer.entities.add({
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
					setLine(addRedLine);
				}
			}
		},
	});
}
