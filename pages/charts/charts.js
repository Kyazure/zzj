import * as echarts from '../../ec-canvas/echarts'; //引入echarts.js
const urlStr = 'https://zzj.wzeal.online';
var dataList = [];
var k = 0;
var Chart = null;
var operationName = null;  //操作名称
Page({
	/**
   * 页面的初始数据
   */
  data: {

    // 组件所需的参数
    nvabarData: {
      showBack: true,
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '地块统计', //导航栏 中间的标题
    },

    fieldBaseId:'',    //基地id
    dikuaiId:'',       //地块id
    ec: {
      lazyLoad: true // 延迟加载
    },
    itemList:[],
    operates:[],
    itemList_x: [     //存x轴数据的数组
     
    ],
    itemList_y: [     //存x轴数据的数组

    ],
    token: wx.getStorageSync('token'),
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("options", options)
    console.log("options.operates")
    
     that.data.operates = JSON.parse(options.operates)
    console.log(that.data.operates)
             
    that.data.fieldBaseId = options.fieldBaseId;
    that.data.dikuaiId = options.dikuaiId;
    console.log("options.fieldBaseId", that.data.fieldBaseId, "dikuaiId", that.data.dikuaiId);

    this.echartsComponnet = this.selectComponent('#mychart');

    this.getData(); //获取数据
  },

  getData: function () {
    //如果是第一次绘制
    this.init_echarts(); //初始化图表

    var that = this;
    var array_x = [''];
    var header_token = that.data.token;
    that.setData({
      itemList: that.data.operates,
    });
    console.log("itemList", that.data.itemList);
    for (var i = 0; i < that.data.itemList.length; i++) {
      console.log("that.data.options.operates[i].operationName", that.data.itemList[i])
      array_x[i] =  that.data.itemList[i].operationName;  //x坐标
      that.data.itemList_y[i] = that.data.itemList[i].totalCount;     //y轴

    }
    that.setData({
      itemList_x: array_x,
    })

    console.log("array_x:", array_x)
    console.log("x轴的值:", that.data.itemList_x)
    console.log("itemList===:", that.data.itemList)
    console.log("y轴的值", that.data.itemList_y)
  //  dataList = res.data;
  //  console.log("List-----", res);
    console.log("----", dataList);

    console.log("token------", header_token)
    console.log(this.selectAllComponents(".mychart"))
    this.setData({
      echartsComponnets: this.selectAllComponents(".mychart")
    })

  //  this.getData();
  },

//   getData: function () {
//   	/**
//   	 * 此处的操作：
//   	 * 获取数据json
//   	 */

//     //如果是第一次绘制
//     this.init_echarts(); //初始化图表
    
//     var that = this;
//     var array_x=[''];
//     var header_token = that.data.token;
//     wx.showLoading({
//       title: '加载中',
//     })
    
//     wx.request({
//       url: urlStr + '/api/v2/field', //接口地址
//       data: {
//         fieldBaseId: that.data.fieldBaseId,
//       },

//       method: 'GET',
//       header: {
//         "Authorization": header_token,
//         'content-type': 'application/json' // 默认值
//       },
//       success: (res) => {
//         wx.hideLoading();  //请求成功时弹窗消失
//         console.log("res-", res);
// //如果此地块id=数组中id，则取出数组中的值
//      for(let i=0;i<res.data.length;i++){
//        if (that.data.dikuaiId == res.data[i].id){
//          that.setData({
//            itemList: res.data[i].operationsList,
//          });
//          break;
//        }
//      }
//         console.log("itemList", that.data.itemList)
        
//       //   for (var i = 0; i < that.data.itemList.length; i++){
//       //     console.log("that.data.itemList[i].operationName", that.data.itemList[i])
//       //     array_x[i] = that.data.itemList[i].operationName;  //x坐标
//       //     that.data.itemList_y[i] = that.data.itemList[i].totalCount;     //y轴
         
//       //  }

//         for (var i = 0; i < that.data.options.operates.length; i++) {
//           console.log("that.data.options.operates[i].operationName", that.data.options.operates[i])
//           array_x[i] = that.data.options.operates[i].operationName;  //x坐标
//           that.data.itemList_y[i] = that.data.options.operates[i].totalCount;     //y轴

//         }
//        that.setData({
//          itemList_x:array_x,
//        })
       
//         console.log("array_x:", array_x)
//         console.log("x轴的值:", that.data.itemList_x)
//         console.log("itemList===:", that.data.itemList)
//         console.log("y轴的值", that.data.itemList_y)
//         dataList = res.data;
//         console.log("List-----", res);
//         console.log("----", dataList);
        
//           console.log("token------", header_token)
//         console.log(this.selectAllComponents(".mychart"))
//         this.setData({
//           echartsComponnets: this.selectAllComponents(".mychart")
//         })
        
//         this.getData();
       
//       },
//     });
//   },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {
    // 指定图表的配置项和数据
    var that = this;
    console.log(that.data.itemList_x);
    var option = {
     // color:['#00ff00'],
      tooltip: { //当你选中数据时的提示框
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          interval: 0,
      //    rotate: 40
        },
        data: that.data.itemList_x,
      //  data:['教室','是否','宿舍','宿舍','方法','方法','请求','曲儿','看看','来了','天天','广告'],
        // 控制网格线是否显示
        splitLine: {
          show: true,
          //  改变轴线颜色
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaaaaa']
          }
        },
      },

      legend: {
         data: ['操作']
        //data: [operationName]
        //data:[this.data.itemList.operationName]
      },


      yAxis: {
        type: 'value',
        name:"/次",
        //max:10,
        minInterval: 1,
        // type: 'category',
        // data:['0','1','2','3','4','5','6','7'],
        //网格线
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
      },

      dataZoom: [
        {   // 这个dataZoom组件，默认控制x轴。
          type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
          xAxisIndex: 0,
          start: 0,      // 左边在 5% 的位置。
          end: 100         // 右边在 60% 的位置。
        },
        {   // 这个dataZoom组件，也控制x轴。
          type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
          xAxisIndex: 0,
          start: 10,      // 左边在 10% 的位置。
          end: 60         // 右边在 60% 的位置。
        },
      ],

      series: [{
        // data: dataList,
        name: ['操作'],
        // name: this.data.itemList.operationName,
       // data: ['2', '3', '1', '5', '7', '0', '1','2','3','6','19','25'],
        data:that.data.itemList_y,
        type: 'bar',
        color: ['#669933'],
        barWidth: 30,   //柱形宽度
       // barGap: '-50%',//柱图间距
        // barGap: '10%',/*多个并排柱子设置柱子之间的间距*/
        // barCategoryGap: '10%',/*多个并排柱子设置柱子之间的间距*/
        // areaStyle: {}
      }]
    }
    return option;

    
  },
  
})
