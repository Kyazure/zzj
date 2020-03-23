const urlStr = 'https://zzj.wzeal.online'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showBack: true,
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '地块列表', //导航栏 中间的标题
    },
    
    //添加与删除
    showOpType: false,              //是否显示 添加 选择界面
    showOpSelection: false,          //是否显示 添加删除 选择界面
    newOpName: '',               //新增的操作类型名称
    x: '',                      //坐标x
    y: '',                      //坐标y
    //当前点击的地块id与操作id
    nowBlockId: '',
    nowOperateId: '',            //当前正在进行操作的 操作类型
    //
    showSelection: false,        //是否显示 修改or删除 选择界面
    flag: true,
    TD: false,
    TC: false,
    dORc: true,
    selection: false,               //删除地块的弹窗是否显示
    showOp: false,                    //操作数据输入框是否显示
    //
    base: '',
    vegetable: '',
    baseName: '',
    dikuai: '',
    baseId:'',
    nb:'',
    Dikuai: [],
    //操作框
    operates: [],
    conp: false,
    opName: '',
    capacity: ''
  },


  //下拉刷新功能
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
   //  this.onLoad()
    //隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh(); //停止下拉事件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var n = options.fieldBaseId;
    this.setData({
      baseId:n,
      baseName: options.name
    }),
    wx.request({
     url: urlStr +'/api/v2/field',
     method:'GET',
     data:{
      fieldBaseId:that.data.baseId
     },
     header:{
       'Content-type': 'application/json',
       "Authorization": wx.getStorageSync('token'),
     },
     success(res) {
      that.setData({
        Dikuai: res.data,     
      });
      //为数组插入新元素showMore
      for (var index in that.data.Dikuai){
        var m = 'Dikuai['+index+'].showMore';
        that.setData({
          [m]:false
        })
      }
     },
    })
    
  },



  //点击地块打开操作类型
  showmore: function(e) {
    var that = this ;
    var m = e.currentTarget.id;
    var list = this.data.Dikuai;

    if (this.data.nowBlockId !== m){
      for (var i=0; i<this.data.Dikuai.length; i++){
        if (this.data.Dikuai[i].id == this.data.nowBlockId){
          var change = 'Dikuai[' + i + '].showMore' 
          this.setData({
            [change]: false
          })
        }
      }
    }

    for(var i=0; i<this.data.Dikuai.length; i++){
      if (this.data.Dikuai[i].id == m){
        var dikuai = 'Dikuai[' + i + '].showMore';
          this.setData({
            nowBlockId: m,
            [dikuai]: !this.data.Dikuai[i].showMore,
            conp: !this.data.Dikuai[i].showMore
          })
      }
    };
    if (this.data.conp){
      wx.request({
        method: 'GET',
        url: urlStr + '/api/v2/operations',
        data: {
          fieldId: parseInt(m)      //integer 地块id
        },
        header: {
          'Content-type': 'application/json',
          "Authorization": wx.getStorageSync('token'),
        },
        success(res){
          var op=res.data
          for(let i=0;i<op.length;i++){
            op[i].imgUrl = 'https://zzj.wzeal.online/' +(op[i].imgUrl)
          }
          that.setData({
            operates: op
          });
        }
      })
    }
  },
  
  // 添加与删除   添加操作栏中的操作类型
    //显示添加界面
    addOpType: function(){
      this.setData({
        showOpType: true ,
      })
    },
    //确认添加
    //读取新增操作类型的数据
    opNameInput: function (e) {
      this.setData({
        newOpName: e.detail.value
      })
    },
    //提交数据
    inAddOpType: function(){
      var that = this;
      var nowBlockId = this.data.nowBlockId;
      var newOpName = this.data.newOpName;
      var nowOperateId = this.data.nowOperateId;
      wx.request({
        method: 'POST',
        url: urlStr + '/api/v2/operations',
        data:{
          createTime: '',	                        //string	创建时间
          fieldId: parseInt(nowBlockId),         //integer	地块id
          id: parseInt(nowOperateId),            //integer	操作类型id
          imgUrl:	'https://zzj.wzeal.online/images/default.png',                       //string	操作类型标志图
          instructions:	 '暂无',                 //string	操作类型说明
          name: newOpName,                      //string 操作类型名
          updateTime:   ''                //string	更新时间
        },
        header: {
          'Content-type': 'application/json',
          "Authorization": wx.getStorageSync('token'),
        },
        success(res) {
          console.log(res);
          wx.showToast({
            title: '添加成功',
          })
          that.opTypeAddHide();
          //showmore更新
          wx.request({
            method: 'GET',
            url: urlStr + '/api/v2/operations',
            data: {
              fieldId: parseInt(nowBlockId)      //integer 地块id
            },
            header: {
              'Content-type': 'application/json',
              "Authorization": wx.getStorageSync('token'),
            },
            success(res) {
              consol.log("image====", res)
              var op = res.data
              for (let i = 0; i < op.length; i++) {
                op[i].imgUrl = 'https://zzj.wzeal.online/' + (op[i].imgUrl)
  
              }

              that.setData({
                operates: op
              });
            }
          })
          //地块更新
          wx.request({
            url: urlStr + '/api/v2/field',
            method: 'GET',
            data: {
              fieldBaseId: that.data.baseId
            },
            header: {
              'Content-type': 'application/json',
              "Authorization": wx.getStorageSync('token'),
            },
            success(res) {
              that.setData({
                Dikuai: res.data,
              });
              //为数组插入新元素showMore
              for (var index in that.data.Dikuai) {
                var m = 'Dikuai[' + index + '].showMore';
                that.setData({
                  [m]: false
                })
              }
              console.log(res.data);
            },
          })
        },
        error(res) {
          console.log(res);
        },
      })
    },
    //停止添加操作栏中的操作类型
    stopOpType: function(){
      this.opTypeAddHide();
    },
    //新增操作类型 隐藏
    opTypeAddHide: function () {
      this.setData({
        showOpType: false
      })
    },
  
  // 添加与删除  删除操作栏中的操作类型
  deleteOpType: function(){
    var that = this;
    var n = this.data.nowBlockId;
    var m = this.data.nowOperateId;
    var array = this.data.operates;
    var t = parseInt(m);
    console.log(typeof(t));
    console.log(t);
    wx.request({
        method:'GET',
        url: urlStr + '/api/v2/operations/delete',
        data:{
          id: parseInt(m)
        },
        header: {
          'Content-type': 'application/json',
          "Authorization": wx.getStorageSync('token'),
        },
        success(res){
          console.log(res.data)
        }
      });
    //删除当前的一个数组元素并在页面上呈现出来
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == m) {
        array.splice(i, 1);
        this.setData({
          operates: array
        })
      }
    };
    //地块更新
    wx.request({
      url: urlStr + '/api/v2/field',
      method: 'GET',
      data: {
        fieldBaseId: that.data.baseId
      },
      header: {
        'Content-type': 'application/json',
        "Authorization": wx.getStorageSync('token'),
      },
      success(res) {
        that.setData({
          Dikuai: res.data,
        });
        //为数组插入新元素showMore
        for (var index in that.data.Dikuai) {
          var m = 'Dikuai[' + index + '].showMore';
          that.setData({
            [m]: false
          })
        }
        console.log(res.data);
      },
    })
  },


  //操作栏中的操作类型长按事件 弹出添加与删除的选择
  longpressChosen: function(e){
    this.setData({
      nowOperateId:  e.currentTarget.id,
      showOpSelection: !this.data.showOpSelection,
      x: e.detail.x + "px",
      y: e.detail.y + "px",
    })
  },
  //添加删除 的隐藏
  back: function(){
    this.setData({      
      showOpSelection: false
    })
  },



//新增操作记录
              
  addOpRecord: function (e) {          //新增操作记录 的显示
    var x;
    var y;
    this.setData({
      nowOperateId: e.currentTarget.id
    })
    var m = this.data.nowOperateId;
    for(var i = 0; i<this.data.operates.length; i++){
      if (this.data.operates[i].id == m){
        x = this.data.operates[i].name;
        y = this.data.operates[i].instructions;
      }
    }
    this.setData({
      showOpRecord: true,       
      opName: x,
      opType: y
    })
  },

  hideRecord: function () {       //新增操作记录 的隐藏
    this.setData({
      showOpRecord: false           
    })
  },
       
  capacityInput: function(e){  
    this.setData({
      capacity: e.detail.value   //获取到输入框的值
    })
  },
  
  inAddOpRecord: function () {           //提交数据
    var that = this;
    var n = this.data.nowBlockId;
    var vegetableName;
    if (this.data.capacity =='')
    {
      // wx.showToast({
      //   title: '输入为空',
      //   icon: 'success',
      //   duration: 2000
      // })
      wx.showToast({
        title: '存在空值',
        image: '/images/beindex/警告.png',
      })
    //  this.hideRecord();
      return;
    }
    for(var i = 0; i<this.data.Dikuai.length; i++ ){
      if(this.data.Dikuai[i].id == n){
        vegetableName = this.data.Dikuai[i].vegetableName
      }
    }  
    wx.request({
      method: 'POST',
      url: urlStr + '/api/v2/operating',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      data:
      {
        capacity: that.data.capacity,          //	number	操作容量（单位/L -- 单位/kg）
        fieldId:    that.data.nowBlockId,              //	integer	地块id
        operationName:  that.data.opName,              //	string	操作类型名
        vegetableName: vegetableName

      },
      success(res) {
        // wx.showToast({
        //   title: '提交成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        that.hideRecord()
        that.setData({
          capacity:''
        })
        //更新地块
        wx.request({
          url: urlStr + '/api/v2/field',
          method: 'GET',
          data: {
            fieldBaseId: that.data.baseId
          },
          header: {
            'Content-type': 'application/json',
            "Authorization": wx.getStorageSync('token'),
          },
          success(res) {
            that.setData({
              Dikuai: res.data,
            });
            //为数组插入新元素showMore
            for (var index in that.data.Dikuai) {
              var m = 'Dikuai[' + index + '].showMore';
              that.setData({
                [m]: false
              })
            }
            console.log(res.data);
            if(res.data.statusCode == 200){
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '提交失败',
                image:'/images/index/fail.png',
                duration: 2000
              })
            }
          },
        })
      }
    })
  },

  stopAdd: function(){                  //取消操作
    this.hideRecord()
  },
  

  //跳转到记录界面
  jilu: function (events) {
    if (this.data.flag) {
      wx: wx.navigateTo({
        url: '/pages/details/details?info=' + events.currentTarget.id,
      })
    }
    else {
      console.log('跳转记录界面失败')
    }
  },
  //隐藏模态对话框
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
  DikuaiNameInput: function (e) {
    this.setData({
      dikuai: e.detail.value
    })
  },
  vegetableNameInput: function (e) {
    this.setData({
      vegetable: e.detail.value
    })
  },
  nameChange: function (e) {  //地块名修改
    this.setData({
      nb: e.detail.value
    })
  },
  placeChange: function (e) {
    this.setData({
      np: e.detail.value
    })
  },


  //新建地块的弹窗显示
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
  * 对话框确认按钮点击事件(新建地块)
  */
  
  onConfirm: function () {
    var that = this;
    var str1 = this.data.dikuai.trim();
    var str2 = this.data.vegetable.trim();
    if (str1.length == 0 || str2.length == 0) {
      wx.showToast({
        title: '存在空值',
        image: '/images/beindex/警告.png',
      })
      return;
    }
    wx.request({
      method: "POST",
      url: urlStr + '/api/v2/field',
      data: {
        name: that.data.dikuai,
        fieldBaseId: that.data.baseId,
        vegetableName: that.data.vegetable
      },
      header: {
        "Authorization": wx.getStorageSync('token'),
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("res2===",res)

        if (res.data == "地块在当前基地下有同名地块!") {
          //窗口判断
          wx.showToast({
            title: '地块不可同名',
            icon: 'success',
            duration: 2000
          })
          that.hideModal();
          return
        }

        wx.request({
          url: urlStr + '/api/v2/field',
          method: 'GET',
          data: {
            fieldBaseId: that.data.baseId,
          },
          header: {
            'Content-type': 'application/json',
            "Authorization": wx.getStorageSync('token'),
          },
          success(res) {
            that.setData({
              Dikuai: res.data,
            });
            //为数组插入新元素showMore
            for (var index in that.data.Dikuai) {
              var m = 'Dikuai[' + index + '].showMore';
              that.setData({
                [m]: false
              })
            }
          },
        })
      },
    })
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
    this.hideModal();
  },
  //隐藏删除框
  hideSelection: function () {
    this.setData({
      showSelection: false,
      flag: true
    })
  },
  //长按实现打开弹窗
  longTap: function (e) {
    var m = e.currentTarget.id
    var n
    for(var i=0; i<this.data.Dikuai.length; i++){
      if(this.data.Dikuai[i].id == m){
        n = this.data.Dikuai[i].name
      }
    }
    this.setData({
      dORc: true,
      TD: false,
      TC: false,
      showSelection: true,
      flag: false,
      nowBlockId: parseInt(m),        //此参数用于后面的修改操作
      dikuai: n
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

  //确认删除地块
  indelete: function (e) {
    var that = this
    var m = this.data.nowBlockId
    var n = this.data.Dikuai
    for(var i=0; i<this.data.Dikuai.length; i++){
      if(this.data.Dikuai[i].id == m){
        n.splice(i,1)
      }
    }
    this.setData({
      Dikuai: n
    })
    wx.request({
      url: urlStr +'/api/v2/field/delete',
      data:{
        //fieldBaseId: that.data.baseId,
        id: that.data.nowBlockId
      },
      method:'POST',
      header:{
        "Authorization": wx.getStorageSync('token'),
        'content-type': 'application/json' // 默认值
      },
    })
    //关闭弹窗
    this.hideSelection()
  },

  //确认修改操作
  inChange: function () {
    var that = this;
    var m = this.data.nowBlockId;
    console.log('type_m',typeof m);
    for (var i = 0; i < this.data.Dikuai.length; i++) {
      if (that.data.Dikuai[i].id == m) {
        this.data.Dikuai[i] = {  id: m ,name:that.data.nb}
        var str1 = this.data.nb.trim();
        if (str1.length == 0 ) {
          wx.showToast({
            title: '存在空值',
            image: '/images/beindex/警告.png',
          })
          return;
        }
        this.setData({
          Dikuai: this.data.Dikuai,
          TD: false,
          TC: false,
          dORc: true,
          flag: true,
        });
        wx.request({
          url: urlStr + '/api/v2/field/update',
          data: {
            id: m,
            name: that.data.nb
          },
          method: 'POST',
          header: {
            "Authorization": wx.getStorageSync('token'),
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res);
            if (res.statusCode == 200) {
            }
          }
        })
        that.hideSelection();
      }
    }
  },
  //跳转到统计页面
  tongJi: function (e) {
    if (this.data.flag) {
      var dikuaiId = e.currentTarget.id
      var operates = null
      console.log("------", this.data.Dikuai)
      for(var i = 0;i<this.data.Dikuai.length; i++){
        if(this.data.Dikuai[i].id == dikuaiId){
          operates = JSON.stringify(this.data.Dikuai[i].operationsList)
        }
      }
      wx: wx.navigateTo({
        url: '/pages/charts/charts?dikuaiId=' + dikuaiId + '&fieldBaseId=' + e.currentTarget.dataset.fieldbaseid + '&operates=' + operates
      })
    } else {
      console.log('跳转统计界面失败')
    }
  },

})