/**
 * @Author: 朱海东
 * @Date: 2023-06-27 16:30:49
 * @name: 
 * @msg: 返回四个屏幕坐标
 * @return {*}
 */
import axios from "axios";
import qs from 'qs';
// const wellknown = require('wellknown');


// // 将十六进制字符串转换为二进制数据
// const hexToBinary = hexString => {
//     const hex = hexString.substr(2); // 去掉前缀 '0101'
//     const binaryString = atob(hex); // 使用 atob() 进行 base64 解码
//     return binaryString;
// };

// // 解析二进制数据为几何对象
// const parseGeometry = binaryString => {
//     const wktData = wellknown.stringify(binaryString);
//     const geometry = wellknown.parse(wktData);
//     return geometry;
// };

// // 解析几何对象，并返回经纬度
// const getCoordinates = geometry => {
//     let coordinates = [];

//     if (geometry.type === 'Point') {
//         coordinates = [geometry.coordinates[1], geometry.coordinates[0]];
//     } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPoint') {
//         coordinates = geometry.coordinates.map(coord => [coord[1], coord[0]]);
//     } // 其他几何类型的处理方式

//     return coordinates;
// };


export function showArea() {
    // 获取当前场景四个坐标

    viewer.camera.changed.addEventListener(function () {
        //清除所有实体
        viewer.entities.removeAll();
        // 在这里获取当前相机屏幕的四个坐标并发起数据请求渲染

        let camera = viewer.camera;
        let viewRectangle = camera.computeViewRectangle();
        let minLon = Cesium.Math.toDegrees(viewRectangle.west);
        let minLat = Cesium.Math.toDegrees(viewRectangle.south);
        let maxLon = Cesium.Math.toDegrees(viewRectangle.east);
        let maxlat = Cesium.Math.toDegrees(viewRectangle.north);
        let location = {
            minLon: minLon,
            minLat: minLat,
            maxLon: maxLon,
            maxLat: maxlat
        }

        // try {
        //     axios.post(IP_ADDRESS_WMS2 + 'getPositionList', qs.stringify(location)).then(response => {
        //         console.log(response.data.data.channel)

        //         const responseData = response.data.data.channel
        //         // const result = responseData.map(item => {
        //         //     const binaryData = hexToBinary(item.geom);
        //         //     const geometry = parseGeometry(binaryData);
        //         //     const coordinates = getCoordinates(geometry);

        //         //     return {
        //         //       name: item.name,
        //         //       coordinates: coordinates
        //         //     };
        //         //   });

        //         //   console.log(result);
             




        //         // 遍历每个实体
        //         // responseData.forEach(entityData => {
        //         //     const name = entityData.name;
        //         //     const geom = entityData.geom;

        //         //     // 解码geom属性为经纬度坐标
        //         //     const lon = decodeGeomToLon(geom);
        //         //     const lat = decodeGeomToLat(geom);
        //         //     console.log(lon)
        //         //     console.log(geom)

        //         //     // 创建实体对象
        //         //     viewer.entities.add({
        //         //         name,
        //         //         position: Cesium.Cartesian3.fromDegrees(lon, lat),
        //         //         point: {
        //         //             pixelSize: 10,
        //         //             color: Cesium.Color.RED
        //         //         }
        //         //     });

        //         // });



        //     });
        // } catch {
        //     console.log('异常')
        // }
        

        let position = Cesium.Cartographic.fromDegrees(114.5457178632316,23.41926302048954);
        // 将Cartographic对象转换为Cartesian3坐标系
        let cartesian = viewer.scene.globe.ellipsoid.cartographicToCartesian(position);

        // 创建一个实体（Entity）以表示标记位置
        let entity = new Cesium.Entity({
            name:'实体一',
            position: cartesian,
            label: {
                text: '小白龙',
                // showBackground: true,
                font: '14px sans-serif',
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -20) // 调整标签位置
            }
        });

        // 将实体添加到场景中
        viewer.entities.add(entity);
        limitEntityHeight(entity,56389,124301)
        // console.log('Allentity2', viewer.entities.values)
    
    });


}


/**
 * @Author: 朱海东
 * @Date: 2023-06-28 09:01:37
 * @name: 
 * @msg: 控制实体只在指定的高度范围上显示，
 * @param {*} entity
 * @param {*} minHeight
 * @param {*} maxHeight
 * @return {*}
 */
function limitEntityHeight(entity, minHeight, maxHeight) {
    console.log('111')
    let entityPosition = entity.position.getValue(viewer.clock.currentTime);
    let cameraPosition = viewer.camera.position;
    
    let distance = Cesium.Cartesian3.distance(entityPosition, cameraPosition);
    
    if (distance < minHeight || distance > maxHeight) {

    //   entity.show = false; // 当距离不在限定范围内时隐藏实体
      viewer.entities.removeAll();
    //   console.log('entity',entity)
      console.log('Allentity', viewer.entities.values)
    } else {
      entity.show = true;
      console.log('显示')
    }
  }



  

