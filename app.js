//app.js
App({
  onLaunch: function () {
    let that = this;
    let phonelogin = wx.getStorageSync('phonelogin');
    that.checkLoginStatus();
  },
  // 检查本地 storage 中是否有登录态标识
  checkLoginStatus: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let phonelogin = wx.getStorageSync('phonelogin');
    if (userInfo) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(为过期)
        success: function () {
          // 直接从Storage中获取用户信息
          let userStorageInfo = wx.getStorageSync('userInfo');
          if (userStorageInfo) {
            that.globalData.userInfo = JSON.parse(userStorageInfo);
          } else {
            that.showInfo('缓存信息缺失');
            console.error('登录成功后将用户信息存在Storage的userStorageInfo字段中，该字段丢失');
          }

        },
        // session_key 过期
        fail: function () {
          // session_key过期

        }
      });
    } else if (phonelogin) {
      let phoneStorageInfo = wx.getStorageSync('phonelogin');
      if (phoneStorageInfo) {
        that.globalData.phonelogin = JSON.parse(phoneStorageInfo);
        console.log(that.globalData.phonelogin)
      }
    }
    else {

    }
  },

  // 封装 wx.showToast 方法
  showInfo: function (info = 'error', icon = 'none') {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true
    });
  },


  globalData: {
    screenH: 0,
    navHeight: 0,
    userInfo: "",
    activetab: 0,
    tabbartype: true,
    token: null,
    city: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    buyinfo: new Array(),
    id: null,
    phonelogin: false,
    pay: null,
    jidi: null,
    tuichu: false,
  }
})

