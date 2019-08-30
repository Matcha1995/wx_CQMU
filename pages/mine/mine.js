//index.js
const app = getApp()
const promisify = require('../../utils/promisify')
const wxGetSetting = promisify(wx.getSetting)
const wxGetUserInfo = promisify(wx.getUserInfo)
const wxCheckSession = promisify(wx.checkSession)
Page({
// 页面初始数据
  data: {
    motto:"Hello World",

    //弹框
    showModalStatus: false,

    //用户信息
    userInfo: {},
    hasWxUserInfo: false,



    //早饭时间
    breakfastTime:["06:30-07:00","07:00-07:30","07:30-08:00","08:00-08:30"],
    breakfastTimeIndex:0,
    //午饭时间
    lunchTime: ["11:00-11:30", "11:30-12:00", "12:00-12:30","12:30-13:00"],
    lunchTimeIndex: 0,
    //晚饭时间
    supperTime:["17:30-18:00","18:00-18:30","18:30-19:00","19:00-19:30"],
    supperTimeIndex: 0,


    // 绑定患者的数据
    showView:false,
    showImage:true,

    // 绑定联系人的数据
    showLinkView: false,
    showLinkImage: true,

    // 患者编号弹框
    hiddenmodalput: true,
    //绑定联系人弹框
    hiddenTelModal1:true,
    hiddenTelModal2: true,
    hiddenTelModal3: true,
    // 饭时间弹框
    hiddenTimeModal:true
  },
  
onLoad:function(){
  this.getUserInfoMagical()

  wx.removeStorageSync('prePatId')
  app.fly.request(app.globalData.apiURL + 'getPatId')
    .then(res => {
      if(res.data.data == null){
        console.log("请添加患者")
      }else{
        // 默认第一个被选中
        res.data.data[0].checked = true
        wx.setStorageSync('prePatId', res.data.data[0].pat_id)
        console.log(res.data.data)
        this.setData({
          radioItems: res.data.data,
        })
      }
    })
    .catch(err => { 
      console.log(err)
    });
},

//点击隐藏or显示患者列表
showHidden: function(){
  console.log(wx.getStorageSync('prePatId'))
  var that = this;
  that.setData({
    showView: (!that.data.showView),
    showImage: (!that.data.showImage),
  })
},
//下拉列表的单项选择
radioChange: function (e) {
  // console.log(e)
  // console.log('radio发生change事件，携带value值为：', e.detail.value);
  let radioItems = this.data.radioItems;
  console.log(this.data.radioItems)
  for (var i = 0, len = radioItems.length; i < len; ++i) {
    // 将所有元素遍历出来，等到点击单选按钮时，当value值与遍历变量一致的时候就把checked设置为true
    radioItems[i].checked = radioItems[i].pat_id == e.detail.value;
    if (radioItems[i].checked == true){
      console.log(radioItems[i])
      if (this.data.showLinkView){
        this.setData({
          showLinkView: (!this.data.showLinkView),
          showLinkImage: (!this.data.showLinkImage)
        })
      }
      // 本地存储被选中的患者编号
      let pat_id = radioItems[i].pat_id
      wx.setStorageSync('prePatId', pat_id)
    }
  }
  
  this.setData({
    radioItems: radioItems
  });
},

  //点击“添加更多”进行患者编号绑定
  addID: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //获取输入框中的患者编号
  getPatId: function (e) {
    console.log(e)
    this.setData({
      pat_id: e.detail.value
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认按钮  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    });
    console.log(this.data)
    let pat_id = this.data.pat_id;
    console.log(this.data.pat_id)

    let _this = this
    app.fly.request(app.globalData.apiURL + 'bindPatId',{pat_id:pat_id})
      .then(res=>{
        console.log(res.data.data)
        if(res.data.statusCode == 200){
          // this.setData({
          //   radioItems: res.data.data,
          // })
          _this.onLoad()
        } 
      })
      .catch(err=>{
        console.log(err)
      });
  },



//点击隐藏或者显示联系人列表
showTel:function(){
  // this.setData({
  //   showLinkView: (!this.data.showLinkView),
  //   showLinkImage: (!this.data.showLinkImage)
  // })
  let pat_id = wx.getStorageSync('prePatId')
  console.log(pat_id)
  if (!pat_id){
    console.log("没有pat_id")
    wx.showToast({
      icon: "none",
      title: "请先绑定患者！"
    })
  }else{
      this.setData({
      showLinkView: (!this.data.showLinkView),
      showLinkImage: (!this.data.showLinkImage)
    })
    if (!this.data.showLinkImage) {
      let _this = this
      app.fly.request(app.globalData.apiURL + 'getTelephone', { pat_id: pat_id })
        .then(res => {
          console.log(res.data.data)
          _this.setData({
            list: res.data.data,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  } 
},
  //点击“请添加联系人”进行联系人1绑定更新
  updateTel1: function () {
    this.setData({
      hiddenTelModal1: !this.data.hiddenTelModal1
    })
  },
//获取输入框中输入的值
  getID1: function (e) {
    this.setData({
      tel1: e.detail.value
    })
  },
  //取消按钮  
  telCancel1: function () {
    this.setData({
      hiddenTelModal1: true
    });
  },
  //确认按钮  
  telConfirm1: function () {
    
    let telephone1 = this.data.tel1;
    console.log(telephone1)
    if (!/^1(3|4|5|7|8)\d{9}$/.test(telephone1)){
      wx.showToast({
        icon: "none",
        title: "请输入正确的电话号码"
      })
      this.setData({
        hiddenTelModal1: true
      })
    }else{
      let pat_id = wx.getStorageSync('prePatId')
      app.fly.request(app.globalData.apiURL + 'bindTelephone', { pat_id: pat_id, telephone1: telephone1, telephone2: '', telephone3: '' })
        .then(res => {
          this.setData({
            hiddenTelModal1: true,
            list: res.data.data
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    
    // let redioitems = this.data.radioItems
    // let length = redioitems.length
    // for (let i = 0; i < length - 1; i++) {
    //   if (redioitems[i].checked == true) {
    //     console.log(redioitems[i])
    //     var pat_id = redioitems[i].pat_id
    //   }
    // }
    // console.log(telephone1, pat_id);
    
  },


  //点击“请添加联系人”进行联系人2绑定更新
  updateTel2: function () {
    this.setData({
      hiddenTelModal2: !this.data.hiddenTelModal2
    })
  },
  //获取输入框中输入的值
  getID2: function (e) {
    this.setData({
      tel2: e.detail.value
    })
  },
  //取消按钮  
  telCancel2: function () {
    this.setData({
      hiddenTelModal2: true
    });
  },
  //确认按钮  
  telConfirm2: function () {
    let telephone2 = this.data.tel2;
    if (!/^1(3|4|5|7|8)\d{9}$/.test(telephone2)){
      wx.showToast({
        icon: "none",
        title: "请输入正确的电话号码"
      })
      this.setData({
        hiddenTelModal2: true
      })
    }else{
      let pat_id = wx.getStorageSync('prePatId')
      app.fly.request(app.globalData.apiURL + 'bindTelephone', { pat_id: pat_id, telephone1: '', telephone2: telephone2, telephone3: '' })
        .then(res => {
          this.setData({
            hiddenTelModal2: true,
            list: res.data.data
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  //点击“请添加联系人”进行联系人3绑定更新
  updateTel3: function () {
    this.setData({
      hiddenTelModal3: !this.data.hiddenTelModal3
    })
  },
  //获取输入框中输入的值
  getID3: function (e) {
    this.setData({
      tel3: e.detail.value
    })
  },
  //取消按钮  
  telCancel3: function () {
    this.setData({
      hiddenTelModal3: true
    });
  },
  //确认按钮  
  telConfirm3: function () {
    let telephone3 = this.data.tel3;
    if (!/^1(3|4|5|7|8)\d{9}$/.test(telephone3)){
      wx.showToast({
        icon: "none",
        title: "请输入正确的电话号码"
      })
      this.setData({
        hiddenTelModal3: true,
      })
    }else{
      let pat_id = wx.getStorageSync('prePatId')
      app.fly.request(app.globalData.apiURL + 'bindTelephone', { pat_id: pat_id, telephone1: '', telephone2: '', telephone3: telephone3 })
        .then(res => {
          this.setData({
            hiddenTelModal3: true,
            list: res.data.data
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    
  },


// 饭点时间设置的弹框js
//设置饭点时间
showTimeSetting:function(){
  let pat_id = wx.getStorageSync('prePatId')
  if(pat_id){
    this.setData({
      hiddenTimeModal: !this.data.hiddenTimeModal
    })
  }else{
    wx.showToast({
      icon: "none",
      title: "请先绑定患者！"
    })
  }
  
},
//取消按钮  
cancelTime: function () {
  this.setData({
    hiddenTimeModal: true
  });
},
//确认按钮  
confirmTime: function () {
  console.log(this.data)
  // 获得早饭、中饭、晚饭时间
  let breakfastIndex = this.data.breakfastTimeIndex //得到选取的早饭时间索引
  let breakfast = this.data.breakfastTime[breakfastIndex]
  let lunchIndex = this.data.lunchTimeIndex
  let lunch = this.data.lunchTime[lunchIndex]
  let supperIndex = this.data.supperTimeIndex
  let dinner = this.data.supperTime[supperIndex]
  console.log(dinner)
  // 获得被选中的pat_id
  let pat_id = wx.getStorageSync('prePatId')
  app.fly.request(app.globalData.apiURL + 'setDinnerTime', { pat_id: pat_id, breakfast: breakfast, lunch: lunch, dinner: dinner})
    .then(res=>{
      this.setData({
        hiddenTimeModal: true
      });
      wx.showToast({
        icon: "none",
        title: "饭点时间设置成功"
      })
    })
    .catch(err=>{
      console.log(err)
    })
},

//选择早饭时间
bindBreakfastTime:function(e){
  console.log(e)
  console.log('picker country 发生选择改变，携带值为', e.detail.value);
  this.setData({
    breakfastTimeIndex:e.detail.value
  })
},
//选择午饭时间
bindLunchTime:function(e){
  console.log('picker country 发生选择改变，携带值为', e.detail.value);
  this.setData({
    lunchTimeIndex:e.detail.value
  })
},
//选择晚饭时间
bindSupperTime:function(e){
  console.log('picker country 发生选择改变，携带值为', e.detail.value);
  this.setData({
    supperTimeIndex:e.detail.value
  })
},

// 长按删除患者编号
deletePatId:function(e){
  let radioitems = this.data.radioItems
  let index = e.currentTarget.dataset.index
  let pat_id = radioitems[index].pat_id
  console.log(index,pat_id)
  let _this = this
  wx.showModal({
    title: '删除确认',
    content: '是否确认删除该患者编号？',
    confirmText: "确定",
    cancelText: "取消",
    success: function (res) {
      console.log(res);
      if (res.confirm) {
        app.fly.request(app.globalData.apiURL + 'deletePatId',{pat_id:pat_id} )
          .then(res=>{
            radioitems.splice(index, 1)
            _this.setData({
              radioItems: radioitems
            })
            _this.onLoad()
            let pat_id = wx.getStorageSync('prePatId')
            console.log(pat_id)
            _this.setData({
              showLinkView: false,
              showLinkImage: true
            })
          })
          .catch(err=>{
            console.log(err)
          })
      } else {
        console.log('用户点击辅助操作')
      }
    }
  });
},

  checkSession: function () {
    //处理登录态问题
    if (wx.getStorageInfoSync('skey')) {
      wxCheckSession()
        .then(
          () => {
            console.log("Wechat Session Key ok");
          }
        )
        .catch(
          () => {
            console.log("Wechat Session Key expired");
            app.userLogin();
          }
        )
    } else {
      // 初次登录
      console.log("skey 不存在")
    }
  },

  setWxUserInfo: function () {
    if (!this.data.hasWxUserInfo) {
      return this.getUserInfoMagical()
        .then(() => {
          this.setData({
            hasWxUserInfo: true
          });
        })
    } else {
      return new Promise((resolve, reject) => {
        resolve()
      });
    }
  },

  getUserInfoMagical: function () {
    // 获取用户微信信息
    return wxGetSetting()
      .then(
        res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            console.log("Bravo! You are authorized!");
            this.setData({
              hasWxUserInfo: true,
              showModalStatus: false
            });
            return wxGetUserInfo();
          } else{
            this.setData({
              showModalStatus: true
            })
            return Promise.reject("Not authorized!");
          }
        }
      )
      .then(
        res => {
          // 获取用户微信信息成功
          // 可以将 res 发送给后台解码出 unionId
          app.globalData.userInfo = res.userInfo;
          console.log("Got your information from Wechat!");
          this.setData({
            userInfo: res.userInfo
            // showModalStatus: false
          });
          this.checkSession();
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  },


//点击“允许登录”，调微信授权
  allowToLogin:function(e){
    console.log(e.detail.userInfo)
    if(e.detail.userInfo){
      this.setWxUserInfo()
    }
  }

})