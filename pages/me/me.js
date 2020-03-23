//index.js
//获取应用实例
var util = require("../../utils/util.js");
const app = getApp()

Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showBack: false,
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的', //导航栏 中间的标题
    },

    show: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    screenH:0,
    index:1,
    avatarUrl: "/images/me/avatar.png",
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '/pages/logs/logs'
    })
  },

  onShow: function () {
    if (app.globalData.userInfo || app.globalData.phonelogin) {
    this.onLoad();
    }
    if (app.globalData.tuichu){
      this.onLoad();
    }
  },
 
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
    click: function () {
      var that = this;
      var show;
      wx.scanCode({
        success: (res) => {
          this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
          that.setData({
            show: this.show
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '失败',
            icon: 'success',
            duration: 2000
          })
        },
        complete: (res) => {
        }
      })
  },
  shoucang:function(){
    wx:wx.navigateTo({
      url: '/pages/shoucang/shoucang',
    })
  },
  yijian: function () {
    wx: wx.navigateTo({
      url: '/pages/yijian/yijian',
    })
  },
  gethelp() {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  about() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  tosetting() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  }
})
