/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-27 16:29:41
 * @LastEditTime: 2023-07-12 18:08:43
 */
/*
 * @Descripttion: 用于控制实体
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-27 16:29:41
 * @LastEditTime: 2023-07-10 17:27:24
 */
import { app } from "../../main.js";
import axios from "axios";
import qs from "qs";
import djAreaData from "../../data/dongjiangAllType";
import detailData from "../../data/dongjiangIntr.js";
import $ from "jquery";

/**
 * @Author: 朱海东
 * @Date: 2023-06-27 16:30:49
 * @name:
 * @msg: 返回四个屏幕坐标
 * @return {*}
 */

// const hammer = new Hammer(window.viewer);
export function showArea() {
  clickBuildingEntity();

  // const matchedData = djAreaData.buildingArray.map((well) => {
  //   const matchingData = detailData.find((data) => data.name == well.name);
  //   return {
  //     ...well,
  //     intr: matchingData ? matchingData.intr : "",
  //     pic: matchingData ? matchingData.pic : "",
  //   };
  // });

  // console.log("matchedData", matchedData);

  viewer.camera.changed.addEventListener(function () {
    //清除地标实体  多清几次  一次清不干净
    for (let i = 0; i < 4; i++) {
      viewer.entities.values.forEach((entity) => {
        if (entity._name.includes("table")) {
          viewer.entities.removeById(entity.id);
        }
      });
    }

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

    //根据不同类型进行渲染实体标记  1市 6县 2镇、乡  3街道、社区、村 乡 4自然保护区、公园 、桥、公路、水库等
    // renderEntity(djAreaData.channel, location, 1);
    renderEntity(djAreaData.cityArray, location, 1);
    renderEntity(djAreaData.townArray, location, 2);
    renderEntity(djAreaData.countyArray, location, 6);
    renderEntity(djAreaData.villageArray, location, 3);
    //
    renderEntity(djAreaData.buildingArray, location, 4);
    renderEntity(djAreaData.nature_reserve, location, 4);
    renderEntity(djAreaData.natural_well, location, 4);
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
  "./bridge.png",
  "./park.png",
  "./reserve.png",
  "./way.png",
  "./tunnel.png",
  "./reservoir.png",
];
function renderEntity(data, location, type) {
  //解构当前屏幕经纬度
  const { minLon, minLat, maxLon, maxLat } = location;
  //筛选符合当前屏幕的数据
  const filteredPlaces = data.filter(({ geom: [lon, lat] }) => {
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
  });
  //绘制市 名实体名称
  if (type == 1) {
    filteredPlaces.forEach((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.geom[0],
        item.geom[1],
      );

      // 创建标签
      const cityLabel = viewer.entities.add({
        name: item.id + item.type,
        position: position,
        label: {
          text: item.name,
          scale: 1.2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 10px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      cityLabel.pic = item.pic;
      cityLabel.intr = item.intr;

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
        name: item.id + item.type,
        position: position,
        label: {
          text: item.name,
          scale: 1.2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      label.pic = item.pic;
      label.intr = item.intr;
      limitEntityHeight(label, 25432, 157987);
    });
  }
  //绘制县级实体名称
  if (type == 6) {
    filteredPlaces.forEach((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.geom[0],
        item.geom[1],
      );

      // 创建标签
      const countyLabel = viewer.entities.add({
        name: item.id + item.type,
        position: position,
        label: {
          text: item.name,
          scale: 1.2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      countyLabel.pic = item.pic;
      countyLabel.intr = item.intr;
      limitEntityHeight(countyLabel, 157987, 407987);
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
        name: item.id + item.type,
        position: position,
        label: {
          text: item.name,
          scale: 1.2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      label.pic = item.pic;
      label.intr = item.intr;
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
        name: item.id + item.type,
        position: position,
        label: {
          text: item.name,
          scale: 1.2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          font: "bold 12px Arial", // 设置字体大小为16像素
          pixelOffset: new Cesium.Cartesian2(0, 15), // 调整实体和标签之间的垂直间距
        },
      });
      // 创建实体

      const entity = viewer.entities.add({
        name: item.id + item.type,
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
                  : item.name.includes("水库")
                    ? ImageUrl[5]
                    : ImageUrl[4],
          scale: 1,
          width: 20,
          height: 20,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 将图片垂直位置设置为实体的正上方
        },
      });
      // 将实体和标签绑定起来

      label.billboard = entity;
      label.pic = item.pic;
      label.intr = item.intr;
      limitEntityHeight(entity, 432, 14999);
      limitEntityHeight(label, 432, 14999);
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
  // let entityPosition = entity.position.getValue(viewer.clock.currentTime);
  // let cameraPosition = viewer.camera.position;
  // let distance = Cesium.Cartesian3.distance(entityPosition, cameraPosition);
  const currentHeight = Math.ceil(viewer.camera.positionCartographic.height);

  if (currentHeight < minHeight || currentHeight > maxHeight) {
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
  // 监听Entity的点击事件
  let entityHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  entityHandler.setInputAction(function (click) {
    let pickedObject = viewer.scene.pick(click.position);

    if (pickedObject) {
      // 获取拾取到的实体位置
      let position = pickedObject.primitive.position;
      let cartographic = Cesium.Cartographic.fromCartesian(position);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      console.log("pickedObject", pickedObject);
      if (pickedObject.primitive._id == undefined) return
      //获取信息
      getExitLocationName(longitude, latitude).then((res) => {
        const id = pickedObject.primitive._id._name.match(/\d+/)[0]; // 使用正则表达式替换掉数字部分得到字段
        const type = pickedObject.primitive._id._name.replace(/\d+/, ""); //请求数据
        let scope = {
          city: res.city,
          district: res.district,
        };

        const requestData = {
          tablename: type,
          gid: Number(id),
          scope: scope,
        };

        //获取数据
        axios
          .post(
            IP_ADDRESS_WMS3 + "getdongjiangDetail",
            qs.stringify(requestData),
          )
          .then(async (res) => {
            const scopeData = {
              scope: scope,
            };

            //获取河长数据
            axios
              .post(
                IP_ADDRESS_WMS3 + "getDongjiangChief",
                qs.stringify(scopeData),
              )
              .then((res) => {
                //提取表名
                console.log("res.sdasdasf.data", res.data.data);
                const filterName = extractPrefix(requestData.tablename);

                const RiverChief = res.data.data.find((i, index) => {
                  if (i.data.level != filterName) {
                    return index == 0;
                  } else {
                    return i.data.level == filterName;
                  }
                });

                const detailObj = {
                  popupShow: true,
                  name: pickedObject.primitive._text,
                  intr: pickedObject.id.intr,
                  pic: pickedObject.id.pic,
                  riverChief:
                    RiverChief == undefined ? "" : RiverChief.data.name,
                };
                // console.log("detailObj", detailObj);
                detailObj.info = res.data.data;

                //传值给详情detailpanel组件
                app.config.globalProperties.$eventBus.emit("detail", detailObj);
                //当前高度
                const currentHeight = Math.ceil(
                  window.viewer.camera.positionCartographic.height,
                );

                // 移动到对象位置
                const flytoLat = longitude;
                const flytoLng = latitude;

                //高于150000根据计算飞行
                if (currentHeight > 15000) {
                  // 利用经纬度坐标计算边界起点到中点的距离
                  const firstLat = flytoLat + 0.1;
                  const firstLng = flytoLng + 0.1;
                  const diameter = Math.sqrt(
                    Math.pow(firstLat - flytoLat, 2) +
                    Math.pow(firstLng - flytoLng, 2),
                  );
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                      flytoLat,
                      flytoLng,
                      diameter * 177770 * 1.5,
                    ),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-90),
                      roll: Cesium.Math.toRadians(0),
                    },
                  });
                } else {
                  viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                      flytoLat,
                      flytoLng,
                      currentHeight,
                    ),
                    orientation: {
                      heading: Cesium.Math.toRadians(0),
                      pitch: Cesium.Math.toRadians(-90),
                      roll: Cesium.Math.toRadians(0),
                    },
                  });
                }
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((error) => {
            console.error("请求失败：", error);
          });
      });
      //
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * @Author: 朱海东
 * @Date: 2023-07-10 16:22:40
 * @name: extractPrefix
 * @msg: 提前tablename字符串
 * @return {*}
 */
function extractPrefix(str) {
  const regex = /(.+)_table/;
  const matches = str.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return "";
  }
}

/**
 * @Author: 朱海东
 * @Date: 2023-07-06 09:50:05
 * @name:
 * @msg:
 * @return {*}
 */
export function getExitLocationName(longitude, latitude) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url:
        `https://apis.map.qq.com/ws/geocoder/v1/?location=` +
        latitude +
        `,` +
        longitude +
        `&key=J4PBZ-YNE6K-YTSJR-AGXXU-ITI6H-Y4FJV&get_poi=1&output=jsonp&callback=?`,
      type: "get",
      dataType: "jsonp",
      success: function (res) {
        // 将结果分别赋值给下面的内容
        if (res && res.result && res.result.address_component) {
          resolve(res.result.address_component);
        } else {
          resolve({});
        }
      },
    });
  });
}
