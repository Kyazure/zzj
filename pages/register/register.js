// pages/register/register.js
const app = getApp();
//const urlStr = 'http://192.168.10.116:9090/zzj'
const urlStr = 'https://zzj.wzeal.online'
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    con:0,
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phone_num: '',
    code: '',
    otherInfo: '',
    sessionId:'',
    userInfo: {},   // 用户信息
    user:"",
    hasLogin: wx.getStorageSync('loginFlag')
      ? true
      : false     // 是否登录，根据后台返回的skey判断
  },

  /**
   * 生命周期函数--监听页面加载
   */

  

  // 检查本地 storage 中是否有skey登录态标识
  checkLoginStatus: function () {
    let that = this;
    let loginFlag = wx.getStorageSync('loginFlag');
    if (loginFlag) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(未过期)
        success: function () {
          // 获取用户头像/昵称等信息
          that.getUserInfo();
        },
        // session_key 已过期
        fail: function () {
          that.setData({
            hasLogin: false
          });
        }
      });
    } else {
      that.setData({
        hasLogin: false
      });
    }
  },

  /**
   * 执行登录操作
   */
  getAuthorization: function(){
    return new Promise(function(resolve,reject){
      wx.login({
        success(res) {
          console.log("res.code=",res);
          if (res.code) {
            wx.request({
              method: 'POST',
              url: urlStr + '/api/v2/user/login/wechat?code=' + res.code,
              success(res) {
                resolve(res.header.Authorization)  
                console.log("login---res====",res)
              }
            })
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    })
  },

  doLogin: function () {
      this.getAuthorization().then(function (theAuthorization){
        wx.setStorageSync('token', theAuthorization)
        wx.switchTab({
          url: '../beindex/beindex',
        })
      })
  },


  /**
   * 从 globalData 中获取 userInfo
   */
  getUserInfo: function () {
    let that = this;

    let userInfo = app.globalData.userInfo;

    console.info('userInfo is:', userInfo);

    if (userInfo) {
      that.setData({
        hasLogin: true,
        userInfo: userInfo
      });
      
      wx.hideLoading();
    } else {
      console.log('globalData中userInfo为空');
    }
  },
  onLoad: function () {
    this.checkLoginStatus();
  },
  onShow: function () {
    let that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    });
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //手机号登陆
  shoujihao :function(e){
    this.setData({
      con: 1
    })
  },
  
  sendcode: function () {
    var phone_num = this.data.phone_num;
    var sessionId = wx.getStorageSync('sessionId');
          wx.request({
            url: urlStr+'/api/v2/user/login/wechat',
            data: {
              phone_num: phone_num
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              wx.setStorageSync('sessionId', 'JSESSIONID=' + res.cookies[0].value)
            }
          })
          this.setData({
           send: false
          })
  },
  checkUserInfoPermission: function () {
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success: function (authSetting) {
              console.log(authSetting)
            }
          });
        }
      },
    })
  },
  

  // 验证码
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },



  denglu: function () {
    var code = this.data.code;
    var sessionId = wx.getStorageSync('sessionId');
    console.log(sessionId)
    var that=this
    wx.request({
      url: 'https://www.guohezuzi.cn/zzb/api/v1/user/login/verified?code='+code,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": sessionId
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var phonelogin = true
        wx.setStorageSync('phonelogin', phonelogin)
        wx.setStorageSync('phoneid', res.data.id)
        wx.setStorageSync('name', res.data.name)
        var user1 = wx.getStorageSync('user')
        var user = [user1[0],{avatarUrl: app.globalData.userInfo.avatarUrl, name: res.data.name, id: res.data.id, accountstatus: false} ]
        wx.setStorageSync('user', user );
        console.log(phonelogin)
        app.globalData.phonelogin=true
        wx.navigateBack({
          
        })
      }
    })
  }

})