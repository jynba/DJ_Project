/**文件注释
 * 版本号：
 * 创建时间：2023/05/17
 * 作者: 许佳宇
 * 用途：公共类函数
 */
import request from './request';
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

/**
 * 变量名：initRiver
 * 作者： 许佳宇
 * 创建时间：2023/05/26
 * 功能：初始化河流
 */
export function initRiver() {
	// 加载geoserver服务
	const dongjiangbound7 = addWebMapData(
		IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
		'dongjiang:dongjiang_bound7'
	);
	const dongjiangriver7 = addWebMapData(
		IP_ADDRESS_WMS + 'geoserver/dongjiang/wms',
		'dongjiang:dongjiang_river7'
	);
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

/**
 * 方法名：mapLabels
 * 作者： 许佳宇
 * 创建时间：2023/05/26
 * 功能：天地图标注
 */
let MAP_LABELS = '';
export function mapLabels() {
	// 获取图层索引，通过show显示与隐藏
	const index = window.viewer.imageryLayers.indexOf(MAP_LABELS);
	if (index == -1) {
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
				show: false,
			})
			// 1 //添加到底部
		);
	} else {
		window.viewer.imageryLayers.get(index).show =
			!window.viewer.imageryLayers.get(index).show;
	}
}

/**
 * 方法名：getBoundaryCenter
 * 创建时间：2023/5/27
 * 作者: 许佳宇
 * 功能：计算给定边界的中心点经纬度
 * @param {Array} boundary - 边界数组，包含多个经纬度坐标点，坐标点以经度、纬度的顺序存储
 * @returns {Array} - 中心点的经纬度，以经度、纬度的顺序存储
 */
export function getBoundaryCenter(boundary) {
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
}

/**
 * 方法名：flyToCenter
 * 创建时间：2023/05/27
 * 作者: 许佳宇
 * 功能：将视角飞到河流范围的中心
 * @param {Array} data - 边界数组，包含多个经纬度坐标点，坐标点以经度、纬度的顺序存储
 */
export function flyToCenter(data) {
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
			diameter * 177770 * 3
		),
		orientation: {
			heading: Cesium.Math.toRadians(0),
			pitch: Cesium.Math.toRadians(-90),
			roll: Cesium.Math.toRadians(0),
		},
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

export function showRiver(movement) {
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
	console.log(longitude, latitude, height, '经纬度高度');
	// 发请求
	request({
		url: '/getriver',
		method: 'post',
		data: {
			lon: longitude,
			lat: latitude,
			// height: height,
			index: 6,
		},
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	}).then((res) => {
		console.log(res);
		// 先清除高亮
		window.viewer.entities.remove(LINE_SEGMENT_LABELING);
		if (res.code == 20000) {
			// 再将视角转到河流中心
			flyToCenter(res.data);
			// 在地球上添加高亮显示当前河流
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
			setLine(addRedLine);
		}
	});
}

// 左键点击高亮
export function clickLeftMouseFunction() {
	let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

	handler.setInputAction(function (movement) {
		debounce(function () {
			showRiver(movement);
		}, 1000)();
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * 方法名：clickRightMouseFunction
 * 创建时间：2023/05/27
 * 作者: 许佳宇
 * 功能：监听右键的事件
 */
export function clickRightMouseFunction() {
	let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);

	handler.setInputAction(function (movement) {
		// 先将高亮清空，并隐藏内容
		window.viewer.entities.removeAll();
		clickNamedRiver(movement);
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

/*
 * 创建时间：2023/05/27
 * 作者: 许佳宇
 * 功能：右键点击命名河流
 */

/**
 * 方法名：publicApi
 * 创建时间：2023/05/27
 * 作者: 许佳宇
 * 功能：展示命名界面的内容的公用界面
 * @param {Object} data - 河流相关信息
 */
function publicApi(data) {
	console.log(data, 'data');
	// 存放链式河流名称的字符串
	let textValue = document.getElementById('textValue');
	textValue.innerText = '';
	// 存放hierarcode截取后的数据
	let hierarcodeList = [];
	// 计算hierarcode有多少层,通过这个可以判断当前河流是否命名.每三位截取一次
	for (let i = 0; i < data.hierarcode.length; i = i + 2) {
		hierarcodeList.push(data.hierarcode.slice(i, i + 2));
	}
	$.ajax({
		url: IP_ADDRESS_WEB1 + 'getriverlog',
		method: 'POST',
		data: {
			hierarcode: data.hierarcode,
			tablename: data.riverlocation,
			basincode: data.basincode,
			regioncode: data.regioncode,
		},
		success: function (riverLogArray) {
			// 清除loading图层
			closeLoadingRiver();
			// 隐藏命名上一级的内容
			document.getElementById('gotolastone').style.display = 'none';
			// 如果返回的结果的长度为0且hierarcode的长度为1,说明还没有命名,当前为最上级的河
			if (riverLogArray.length == 0 && hierarcodeList.length == 1) {
				RIVER_ZH_NAME.value = '未命名';
				// 说明没有链式结构的河流
				textValue.innerText = '';
				// 打开命名界面
				document.getElementsByClassName('panelText2')[0].style.display =
					'block';
			}
			// 否则则会进行判断
			else {
				document.getElementsByClassName('panelText2')[0].style.display =
					'block';
				// 如果查询得到的数组长度+1等于当前河流的分割长度的话,说明当前河流没有命名
				if (
					riverLogArray.length !== hierarcodeList.length &&
					riverLogArray.length + 1 == hierarcodeList.length
				) {
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
							CHAINED_TEXT += riverFullName;
						}
						// 否则就需要在两个名称中间添加-
						else if (i != riverLogArray.length - 1) {
							CHAINED_TEXT += riverFullName + '-';
						}
						// 为河段名添加未命名
						document.getElementById('zh_name').value = '未命名';
					});
					// 获取合并后的链式字符串
					let beforeFull = mergeFullName(CHAINED_TEXT);
					// 替换可能存在的@符合
					textValue.innerHTML = beforeFull.replace('@', '-');
					//  如果返回的结果与code长度一致,说明已经命好名了
				} else if (riverLogArray.length == hierarcodeList.length) {
					document.getElementsByClassName('panelText2')[0].style.display =
						'block';
					// 继续遍历返回的结果
					riverLogArray.map((v, i) => {
						const {
							rivername,
							shuilicode,
							source,
							discharge,
							englishname,
							staionname,
						} = v;
						// 判断河流名称是否存在-符号
						let rivernames =
							rivername.indexOf('-') == -1
								? rivername
								: rivername.replace('-', '@');
						// 倒数第二个河流名不需要添加-
						if (i == riverLogArray.length - 2) {
							CHAINED_TEXT += rivernames;
						}
						// 倒数第二个往前都需要添加
						else if (
							i != riverLogArray.length - 2 &&
							i != riverLogArray.length - 1
						) {
							CHAINED_TEXT += rivernames + '-';
						}
						// 当为最后一个时,说明为当前点击的河流名称
						else if (i == riverLogArray.length - 1) {
							// 往输入框添加最后的河流名称
							document.getElementById('zh_name').value = rivername;
							// 如果存在英文名，则添加
							if (englishname && englishname.length > 0) {
								RIVER_EN_NAME.value = englishname;
							}
							// 在选择列表中，找到当前命名依据所对应的value值
							const flags = SELECT_LIST.find((v) => v.text == source);
							// 如果能找到，说明在0-5之间
							if (flags) {
								NAMING_REASON.value = flags.value;
								// 否则则说明是6，需要添加输入框，并将内容填入
							} else {
								NAMING_REASON.value = '6';
								// 创建输入框元素
								let textArea = document.createElement('input');
								// 设置id
								textArea.setAttribute('id', 'basisValue');
								// 在命名依据选项框后面添加
								document.getElementById('selectValue').after(textArea);
								let basisValue = document.getElementById('basisValue');
								basisValue.value = source;
							}
							// 添加中国河流代码
							CHINESE_RIVER_CODE.value = shuilicode;
							// 添加平均流量信息
							AVERAGE_FLOW.value = discharge;
							// 添加水文站信息
							document.getElementById('panel2Input5').value = staionname;
						}
					});
					// 获取用户信息，用于确认当前河段是否可以修改，当命名者与用户一致时，允许修改
					let globalusername = decryptionCode(
						localStorage.getItem('globalusername')
					);
					if (
						globalusername == riverLogArray[riverLogArray.length - 1].username
					) {
						// 添加刚刚获得的最后一条信息，用于后续提交
						RIVER_DATA_DETAIL = riverLogArray[riverLogArray.length - 1];
						// 添加修改河流名的函数
						document
							.getElementById('submits')
							.setAttribute('onclick', 'changeFullName()');
					} else {
						// 禁用点击按钮
						document
							.getElementById('submits')
							.setAttribute('onclick', 'checkRiverForm()');
						document.getElementById('submits').setAttribute('disabled', true);
					}
					// 获取合并后的链式字符串
					let beforeFull = mergeFullName(CHAINED_TEXT);
					// 替换可能存在的字符串
					textValue.innerHTML = beforeFull.replace('@', '-');
					// 否则，则说明当前河段的上一级也没有进行命名，需要先命名上一级的河段
				} else {
					document.getElementsByClassName('panelText2')[0].style.display =
						'none';
					textValue.innerText = '请先命名上一级河流名';
					RIVER_ZH_NAME.value = '未命名';
					// 打开前往上一级的盒子
					document.getElementById('gotolastone').style.display = 'block';
					document.getElementById('gotoclose').style.display = 'block';
					document.getElementById('submits').setAttribute('disabled', true);
					document.getElementById('panel2').style.height = '150px';
					document.getElementById('panel2').style.width = '230px';
					//当前高亮河段信息
					RIVER_DATA = data;
					// 移除多余的信息
					delete RIVER_DATA.scope;
				}
			}
			document.getElementById('panel2').style.display = 'block'; //显示table
		},
	});
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
