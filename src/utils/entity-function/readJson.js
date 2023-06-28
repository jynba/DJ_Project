
// import json_data from './RiverChief.json'
// 114.79664060847114 23.821542687900074
//115.19712749774703 24.243981497394184
let longitude=115.19712749774703
let latitude=24.243981497394184

export function getAdministrativeArea(){
	$.ajax({
		type:'GET',
		url:`https://apis.map.qq.com/ws/geocoder/v1/?location=` + latitude + `,` + longitude + `&key=J4PBZ-YNE6K-YTSJR-AGXXU-ITI6H-Y4FJV&get_poi=1&output=jsonp&callback=?`,
		async:false,
		dataType : "jsonp",//数据类型为jsonp  
		jsonp : "jsonpCallback",//服务端用于接收callback调用的function名的参数
		success:function(res){
			  fetch('./RiverChief.json')
			  .then((response) => response.json())
			  .then((data) =>{
				//   console.log(res)
				//经纬度匹配到的行政信息
				  console.log(res.result.address_component)
	
				  let address_component=res.result.address_component
				//   let nation=address_component.nation
				//   let province=address_component.province
	
				//城市名
				  let city=address_component.city
				//区名或者县名
				  let district=address_component.district
				  
				//json格式的数据列表信息及相关河长信息
				  console.log(data.dongjiangliuyu)
	
				//   console.log(data.dongjiangliuyu[0])
				  for(let i=0;i<data.dongjiangliuyu.length;i++){
					if(city==data.dongjiangliuyu[i].city){
						//市级河长信息
						console.log(data.dongjiangliuyu[i].MunicipalRiverChief)
						for(let item of data.dongjiangliuyu[i].countryList){
							// console.log(item)
							if(item.country==district){
								// console.log(1)
								//县级河长信息
								console.log(item.countyHead)
								//渲染代码
	
							}
	
						}
					}
					else{}
				  }
	
			  })
			  .catch((err)=>console.error(err))
		  
		}
	})
	
}



