/*
 * @Descripttion: 用于控制实体
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-27 16:29:41
 * @LastEditTime: 2023-06-29 17:44:44
 */
import { app } from '../../main.js';
import axios from "axios";
import qs from "qs";
import Hammer from "hammerjs";
import wellknown from "wellknown";
import djAreaData from "../../data/dongjiangAllType";

/**
 * @Author: 朱海东
 * @Date: 2023-06-27 16:30:49
 * @name:
 * @msg: 返回四个屏幕坐标
 * @return {*}
 */

// const hammer = new Hammer(window.viewer);
export function showArea() {
  clickBuildingEntity()
  //  // 过滤镇和乡
  // let buildingArray = djAreaData.natural_place_name.filter(item =>item.name.includes('公园'));

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
      maxLat: maxlat,
    };

    //根据不同类型进行渲染实体标记  1市  2镇、乡  3街道、社区、村 乡 4自然保护区、公园  5水库
    // renderEntity(djAreaData.channel, location, 1);
    renderEntity(djAreaData.cityArray, location, 1);
    renderEntity(djAreaData.townArray, location, 2);
    renderEntity(djAreaData.villageArray, location, 3);
    renderEntity(djAreaData.buildingArray, location, 4);
  });
}

/**
 * @Author: 朱海东
 * @Date: 2023-06-28 16:46:07
 * @name: renderEntity
 * @msg: 绘制不同属性的实体
 * @return {*}
 */
const ImageUrl = [
  "src/assets/bridge.png",
  "src/assets/park.png",
  "src/assets/reserve.png",
  "src/assets/way.png",
  "src/assets/tunnel.png",
];
function renderEntity(data, location, type) {
  //解构当前屏幕经纬度
  const { minLon, minLat, maxLon, maxLat } = location;
  //筛选符合当前屏幕的数据
  const filteredPlaces = data.filter(({ geom: [lon, lat] }) => {
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
  });
  //绘制城市名实体名称
  if (type == 1) {
    filteredPlaces.forEach((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.geom[0],
        item.geom[1],
      );

      // 创建标签
      const cityLabel = viewer.entities.add({
        name: item.id,
        position: position,
        label: {
          text: item.name,
          scale: 0.8,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 10px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });

      limitEntityHeight(cityLabel, 157987, 753338);
    });
  }
  //绘制镇乡名实体名称
  if (type == 2) {
    filteredPlaces.forEach((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.geom[0],
        item.geom[1],
      );

      // 创建标签
      const label = viewer.entities.add({
        name: item.id,
        position: position,
        label: {
          text: item.name,
          scale: 0.8,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      limitEntityHeight(label, 25432, 157987);
    });
  }
  //绘制村、街道、社区实体名称
  if (type == 3) {
    filteredPlaces.forEach((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.geom[0],
        item.geom[1],
      );

      // 创建标签
      const label = viewer.entities.add({
        name: item.id,
        position: position,
        label: {
          text: item.name,
          scale: 0.8,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      limitEntityHeight(label, 118, 25432);
    });
  }

  //绘制自然保护区、公园实体+图标
  if (type == 4) {
    filteredPlaces.forEach((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.geom[0],
        item.geom[1],
      );

      // 创建标签
      const label = viewer.entities.add({
     
        position: position,
        label: {
          text: item.name,
          scale: 0.8,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      // 创建实体
      console.log(item.name.includes("桥"));
      const entity = viewer.entities.add({
        name: item.id,
        position: position,
        billboard: {
          image: item.name.includes("桥")
            ? ImageUrl[0]
            : item.name.includes("公园")
            ? ImageUrl[1]
            : item.name.includes("保护区")
            ? ImageUrl[2]
            : item.name.includes("公路")
            ? ImageUrl[3]
            : ImageUrl[4],
          scale: 1,
          width: 20,
          height: 20,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 将图片垂直位置设置为实体的正上方
        },
      });
      // 将实体和标签绑定起来

      label.billboard = entity;
      limitEntityHeight(entity, 432, 25432);
      limitEntityHeight(label, 432, 25432);
     
    });
  }
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
  let entityPosition = entity.position.getValue(viewer.clock.currentTime);
  let cameraPosition = viewer.camera.position;

  let distance = Cesium.Cartesian3.distance(entityPosition, cameraPosition);

  if (distance < minHeight || distance > maxHeight) {
    // 遍历实体集合，根据 name 属性删除匹配的实体
    viewer.entities.values.forEach((item) => {
      if (item._name === entity._name) {
        viewer.entities.remove(entity);
      }
    });
  } else {
    entity.show = true;
  }
}

/**
 * @Author: 朱海东
 * @Date: 2023-06-29 10:05:24
 * @name:
 * @msg: 计算经纬度数组中的中心点
 * @return {*}
 */
function calculateCenterPoint(coordinates) {
  const center = coordinates.reduce(
    (acc, current, index) => {
      if (index % 2 === 0) {
        acc.longitudes.push(current);
      } else {
        acc.latitudes.push(current);
      }
      return acc;
    },
    { longitudes: [], latitudes: [] },
  );

  const centerLongitude =
    center.longitudes.reduce((sum, current) => sum + current, 0) /
    center.longitudes.length;
  const centerLatitude =
    center.latitudes.reduce((sum, current) => sum + current, 0) /
    center.latitudes.length;

  return [centerLongitude, centerLatitude];
}

/**
 * @Author: 朱海东
 * @Date: 2023-06-29 16:41:36
 * @name:
 * @msg:
 * @return {*}
 */
function clickBuildingEntity() {

  // const data = 'Hello from jsa.js';
  // app.config.globalProperties.$eventBus.emit('myData', data);
  // 监听Entity的点击事件
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction(function (click) {
    let pickedObject = viewer.scene.pick(click.position);
    console.log(pickedObject.primitive)
    console.log(pickedObject.primitive._id._name)
    // if (pickedObject && pickedObject.id === entity) {
    //   console.log('1111');
    // }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
