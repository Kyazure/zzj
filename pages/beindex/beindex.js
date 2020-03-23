//index.js
//获取应用实例
const app = getApp();
//const urlStr = 'http://192.168.43.158:9090/zzj';
const urlStr = 'https://zzj.wzeal.online';
Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showBack: false,
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '基地列表', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20, 
    nowBlockId: '',
    TD: false,
    TC: false,
    dORc: true,
    flag: true,
    selection: false,
    b: '',             //原基地名
    p: '',             //原位置
    nb: '',
    np: '',
    deleteId: '',
    updateId: '',
    showModal: false,
    bases: [],
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },

  /**
  * 隐藏模态对话框
  */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
  * 对话框取消按钮点击事件
  */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 基地名输入
   */
  baseNameInput: function (e) {
    this.setData({
      b: e.detail.value       // 获取当前表单元素输入框内容
    })
  },
  /**
   * 基地位置输入
   */
  placeNameInput: function (e) {
    this.setData({
      p: e.detail.value
    })
  },
  nameChange: function (e) {
    this.setData({
      nb: e.detail.value
    })
  },
  placeChange: function (e) {
    this.setData({
      np: e.detail.value
    })
  },

//下拉刷新功能
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.onLoad()
    //隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh(); //停止下拉事件
  },



  /**
  * 对话框确认按钮点击事件(新建基地)
  */
  onConfirm: function () {
    var that = this;
    const length = this.data.bases.length

    //判断输入的值是否为空
    var str1 = this.data.b.trim();
    var str2 = this.data.p.trim();
    if (str1.length == 0 || str2.length == 0) {
      wx.showToast({
        title: '存在空值',
        image: '/images/beindex/警告.png',
      })  
      return;
    }

    wx.request({
      method: "POST",
      url: urlStr + '/api/v2/field_base',
      data: {
        name: that.data.b,
        location: that.data.p
      },
      header: {
        "Authorization": wx.getStorageSync('token'),
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("res=====", res)
        if (res.data == "您已新增过相同名字的基地!!!" ){
          //窗口判断
          wx.showToast({
            title: '基地不可同名',
            icon: 'success',
            duration: 2000
          })
          that.hideModal();
          return
        }

       wx.request({
          url: urlStr + '/api/v2/field_base',
          method: "GET",
          data: {

          },
          header: {
            'Content-type': 'application/json',
            "Authorization": wx.getStorageSync('token'),
          },

          success(res) {
            //将获取到的json数据,存在名字bases的这个数组中
            that.setData({
              bases: res.data     //res代表success函数的事件对,data是固定的，bases是数组
            });
          }
        })
      }
    })
    wx.showToast({
      title: '创建成功',
      icon: 'success',
      duration: 2000
    })
    this.hideModal();
  },

  //单击函数,跳转到地块页面
  todikuai: function (e) {
    var that = this;
    var m = e.currentTarget.id;   //通过点击事件拿出基地的id传到地块页面
    var n = e.currentTarget.dataset.dname   //通过点击事件拿出基地的name传到地块页面
    if (that.data.flag) {
      wx.navigateTo({
        url: '../index/index?name=' + n + '&fieldBaseId=' + m,
      })
    }
    else {
      console.log("stop go to next page")
    }
  },


  //隐藏删除框
  hideSelection: function () {
    this.setData({
      selection: false,
      flag: true
    })
  },
  //长按实现打开弹窗
  longTap: function (e) {
    this.setData({
      selection: true,
      flag: false,
      deleteId: e.currentTarget.id,
      nowBlockId: e.currentTarget.id,             //此参数用于后面的修改操作
    })
  },

  //删除or修改基地
  //选择删除
  toDelete: function () {
    this.setData({
      dORc: false,
      TD: true
    })
  },

  //选择修改
  toChange: function () {
    this.setData({
      dORc: false,
      TC: true
    })
  },


  //确认删除基地
  indelete: function () {
    var that = this
    wx.request({
      url: urlStr + '/api/v2/field_base/delete',
      data: {
        id: that.data.deleteId
      },
      method: 'POST',
      header: {
        "Authorization": wx.getStorageSync('token'),
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.statusCode == 400) {   
          wx.showToast({
              title: '基地下有地块',
              image: '/images/beindex/警告.png',
          })
          return
        }
        wx.showToast({
          title: '删除成功',
        })
        wx.request({
          url: urlStr + '/api/v2/field_base',
          method: "GET",
          data: {
          },
          header: {
            'Content-type': 'application/json',
            "Authorization": wx.getStorageSync('token'),
          },
          success(res) {
            //将获取到的json数据,存在名字bases的这个数组中
            that.setData({
              bases: res.data     //res代表success函数的事件对,data是固定的，bases是数组
            });
          }
        })
      },
    })
    

    //关闭弹窗
    this.hideSelection()
    this.setData({
      flag: true
    })
  },

  //取消删除
  nodelete: function () {
    this.hideSelection()
    this.setData({
      TD: false,
      TC: false,
      dORc: true,
      flag: true,
    })
  },

  //确认修改操作
  inChange: function () {
    var that = this;
    var m = this.data.nowBlockId;
    for (var i = 0; i < this.data.bases.length; i++) {
      if (this.data.bases[i].id == m) {
        this.data.bases[i] = { name: this.data.nb, location: this.data.np, id: m }
        var str1 = this.data.nb.trim();
        var str2 = this.data.np.trim();
        if (str1.length == 0 || str2.length == 0) {
          wx.showToast({
            title: '存在空值',
            image: '/images/beindex/警告.png',
          })
          return;
        }
        this.setData({
          bases: this.data.bases,
          TD: false,
          TC: false,
          dORc: true,
          flag: true,
        })
        var request_basesName = this.data.bases[i].name;
        var request_basesLocation = this.data.bases[i].location;

        wx.request({
          url: urlStr + '/api/v2/field_base/update',
          data: {
            id: m,
            name: request_basesName,
            location: request_basesLocation
          },
          method: 'POST',
          header: {
            "Authorization": wx.getStorageSync('token'),
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res);
            if (res.statusCode == 200) {
              console.log('修改成功');
            }
          },

          error(res) {
          },

        })
        that.hideSelection();
        break;
      }
    }
  },


  noChange: function () {
    this.setData({
      TD: false,
      TC: false,
      dORc: true,
      flag: true,
    })
    this.hideSelection();
  },







  /**
     * 生命周期函数--监听页面加载(查询全部基地渲染到页面)
     */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: urlStr + '/api/v2/field_base',
      method: "GET",
      data: {

      },
      header: {
        'Content-type': 'application/json',
        "Authorization": wx.getStorageSync('token'),
      },
      success(res) {
        //将获取到的json数据,存在名字bases的这个数组中
        that.setData({
          bases: res.data     //res代表success函数的事件对,data是固定的，bases是数组
        });
        console.log("res.data", res.data)
      }
    })


  }

})
