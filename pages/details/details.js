// pages/details/details.js
const urlStr = 'https://zzj.wzeal.online';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showBack: true,
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '记录详情', //导航栏 中间的标题
    },
    theBlockId:'',
    nowBlockId: null,
    x: '0',
    y: '0',
    showSelection: false,
    showModal:false,
    type:true,
    operates:[],
    caozuo:[],
    caozuos:[],
    fieldId: ''
  },

  //下拉刷新功能
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    // this.onLoad()
    //隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh(); //停止下拉事件
  },

  onLoad: function (options){
    var that = this;
    var fieldId = options.info;
    wx.request({
      method: 'GET',
      url: urlStr + '/api/v2/operating',
      data:{
          fieldId: fieldId,
          n: 7
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      success(res){
        var op = res.data
        for (let i = 0; i < op.length; i++) {
          op[i].imgUrl = 'https://zzj.wzeal.online/' + (op[i].imgUrl)
        }
        that.setData({
          caozuo: op,
          caozuos: op,
          fieldId: fieldId
        })
        console.log(res.data)
      }
    }),
      wx.request({
        method: 'GET',
        url: urlStr + '/api/v2/operations',
        data: {
          fieldId: fieldId      //integer 地块id
        },
        header: {
          'Content-type': 'application/json',
          "Authorization": wx.getStorageSync('token'),
        },
        success(res) {
          that.setData({
            operates: res.data
          });
          console.log(res.data)
        }
      })
  },
  //长按打开删除置顶弹窗
  longTap: function (e) {
    console.log(e);
    var x = e.detail.x + "px";
    var y = e.detail.y + "px";
    var z = e.currentTarget.id;
    this.setData({
      x: x,
      y: y,
      showSelection: 'ture',
      nowBlockId: z
    });
  },
  //删除记录
  toDelete: function () {
    for (var i = 0; i < this.data.caozuo.length; i++) {
      if (this.data.caozuo[i].id == this.data.nowBlockId) {
        this.data.caozuo.splice(i, 1)
        this.setData({
          caozuo: this.data.caozuo,
          showSelection: false
        })
        return;
      }
    }
  },
  //隐藏删除与置顶的选择
  none: function () {
    this.setData({
      showSelection: false
    })
  },


//一周
  oneWeek: function(){
    var that = this
    wx.request({
      method: 'GET',
      url: urlStr + '/api/v2/operating',
      data: {
        fieldId: that.data.fieldId,
        n: 7
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        var op = res.data
        for (let i = 0; i < op.length; i++) {
          op[i].imgUrl = 'https://zzj.wzeal.online/' + (op[i].imgUrl)
        }
        that.setData({
          caozuo: op
        })
        console.log(op)
      }
    })
  },
  //两周
  twoWeeks: function(){
    var that = this
    wx.request({
      method: 'GET',
      url: urlStr + '/api/v2/operating',
      data: {
        fieldId: that.data.fieldId,
        n: 14
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        var op = res.data
        for (let i = 0; i < op.length; i++) {
          op[i].imgUrl = 'https://zzj.wzeal.online/' + (op[i].imgUrl)
        }
        that.setData({
          caozuo: op
        })
        console.log(op)
      }
    })
  },
  //三周
  threeWeeks: function(){
    var that = this
    wx.request({
      method: 'GET',
      url: urlStr + '/api/v2/operating',
      data: {
        fieldId: that.data.fieldId,
        n: 21
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        var op = res.data
        for (let i = 0; i < op.length; i++) {
          op[i].imgUrl = 'https://zzj.wzeal.online/' + (op[i].imgUrl)
        }
        that.setData({
          caozuo: op
        })
      }
    })
  },

  //操作类型筛选
  click: function(e){
    var m = e.currentTarget.id
    var arr = []
    for (var i = 0; i < this.data.caozuos.length; i++) {
      if (this.data.caozuos[i].operationName == m){
        arr.push(this.data.caozuos[i])
      }
    }
    this.setData({
      caozuo: arr,
    })
  },
})