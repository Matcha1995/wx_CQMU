//index.js
const app = getApp()
Page({
// 页面初始数据
  data: {
    motto:"Hello World",
    userInfo:{
      avatarUrl:"",  //用户头像
      nickName:"",   //用户昵称
    },

    // radioItems: [
    //    { name: '001',  checked: true},
    //    { name: '002'}
    // ],

    //早饭时间
    breakfastTime:["6:30","7:00","7:30","8:00"],
    breakfastTimeIndex:0,
    //午饭时间
    lunchTime: ["11:30", "12:00", "12:30"],
    lunchTimeIndex: 0,
    //晚饭时间
    supperTime:["18:00","18:30","19:00","19:30"],
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
    hiddenTelModal:true,
    // 饭时间弹框
    hiddenTimeModal:true
  },
  
onLoad:function(){
  // var that=this;
  
  // //获取用户信息
  // wx.getUserInfo({
  //   success:function(res){
  //     console.log(res)
  //     var avatarUrl = 'userInfo.avatarUrl';
  //     var nickName = 'userInfo.nickName';
  //     that.setData({
  //       [avatarUrl]: res.userInfo.avatarUrl,
  //       [nickName]: res.userInfo.nickName,
  //     })
  //   }
  // })

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           app.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  app.fly.request(app.globalData.apiURL + 'getPatId')
    .then(res => {
      // 默认第一个被选中
      res.data.data[0].checked = true
      this.setData({
        radioItems: res.data.data,
      })
    })
    .catch(err => { 
      console.log(err)
    });
},

//点击隐藏or显示患者列表
showHidden: function(){
  var that = this;
  that.setData({
    showView: (!that.data.showView),
    showImage: (!that.data.showImage),
  })
},
//下拉列表的单项选择
radioChange: function (e) {
  console.log(e)
  console.log('radio发生change事件，携带value值为：', e.detail.value);
  let radioItems = this.data.radioItems;
  console.log(this.data.radioItems)
  for (var i = 0, len = radioItems.length; i < len; ++i) {
    // 将所有元素遍历出来，等到点击单选按钮时，当value值与遍历变量一致的时候就把checked设置为true
    radioItems[i].checked = radioItems[i].pat_id == e.detail.value;
    if (radioItems[i].checked == true){
      console.log(radioItems[i])
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
        if(res.statusCode == 200){
          _this.setData({
            radioItems: res.data.data,
          })
        } 
      })
      .catch(err=>{
        console.log(err)
      });
  },



//点击隐藏或者显示联系人列表
showTel:function(){
  this.setData({
    showLinkView: (!this.data.showLinkView),
    showLinkImage: (!this.data.showLinkImage)
  })
 
  let redioitems = this.data.radioItems
  let length = redioitems.length
  for(let i=0;i<length-1;i++){
    if (redioitems[i].checked == true){
      console.log(redioitems[i])
      var pat_id = redioitems[i].pat_id
    }
  }
  if (!this.data.showLinkImage){
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
  
},
  //点击“请添加联系人”进行联系人1绑定更新
  updateTel1: function () {
    this.setData({
      hiddenTelModal: !this.data.hiddenTelModal
    })
  },
//获取输入框中输入的值
  getID: function (e) {
    this.setData({
      tel1: e.detail.value
    })
  },
  //取消按钮  
  telCancel: function () {
    this.setData({
      hiddenTelModal: true
    });
  },
  //确认按钮  
  telConfirm: function () {
    let telephone1 = this.data.tel1;
    let redioitems = this.data.radioItems
    let length = redioitems.length
    for (let i = 0; i < length - 1; i++) {
      if (redioitems[i].checked == true) {
        console.log(redioitems[i])
        var pat_id = redioitems[i].pat_id
      }
    }
    console.log(telephone1,pat_id);
    app.fly.request(app.globalData.apiURL + 'bindTelephone', {pat_id:pat_id, telephone1: telephone1, telephone2: '', telephone3:'' })
    .then(res=>{
      this.setData({
        hiddenTelModal: true,
        list:res.data.data
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },


  //点击“请添加联系人”进行联系人2绑定更新
  updateTel2: function () {
    this.setData({
      hiddenTelModal: !this.data.hiddenTelModal
    })
  },
  //获取输入框中输入的值
  getID: function (e) {
    this.setData({
      tel2: e.detail.value
    })
  },
  //取消按钮  
  telCancel: function () {
    this.setData({
      hiddenTelModal: true
    });
  },
  //确认按钮  
  telConfirm: function () {
    let telephone2 = this.data.tel2;
    let redioitems = this.data.radioItems
    let length = redioitems.length
    for (let i = 0; i < length - 1; i++) {
      if (redioitems[i].checked == true) {
        var pat_id = redioitems[i].pat_id
      }
    }
    console.log(telephone2, pat_id);
    app.fly.request(app.globalData.apiURL + 'bindTelephone', { pat_id: pat_id, telephone1: '', telephone2: telephone2, telephone3: '' })
      .then(res => {
        this.setData({
          hiddenTelModal: true,
          list: res.data.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  },

  //点击“请添加联系人”进行联系人3绑定更新
  updateTel3: function () {
    this.setData({
      hiddenTelModal: !this.data.hiddenTelModal
    })
  },
  //获取输入框中输入的值
  getID: function (e) {
    this.setData({
      tel3: e.detail.value
    })
  },
  //取消按钮  
  telCancel: function () {
    this.setData({
      hiddenTelModal: true
    });
  },
  //确认按钮  
  telConfirm: function () {
    let telephone3 = this.data.tel3;
    let redioitems = this.data.radioItems
    let length = redioitems.length
    for (let i = 0; i < length - 1; i++) {
      if (redioitems[i].checked == true) {
        var pat_id = redioitems[i].pat_id
      }
    }
    console.log(telephone3, pat_id);
    app.fly.request(app.globalData.apiURL + 'bindTelephone', { pat_id: pat_id, telephone1: '', telephone2: '', telephone3: telephone3 })
      .then(res => {
        this.setData({
          hiddenTelModal: true,
          list: res.data.data
        })
      })
      .catch(err => {
        console.log(err)
      })
  },


// 饭点时间设置的弹框js
//设置饭点时间
showTimeSetting:function(){
  this.setData({
    hiddenTimeModal: !this.data.hiddenTimeModal
  })
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
  let supper = this.data.supperTime[supperIndex]
  // 获得被选中的pat_id
  let redioitems = this.data.radioItems
  let length = redioitems.length
  // console.log(redioitems, length)
  for (let i = 0; i < length - 1; i++) {
    if (redioitems[i].checked == true) {
      var pat_id = redioitems[i].pat_id
      // console.log(pat_id)
    }
  }
  app.fly.request(app.globalData.apiURL + 'setDinnerTime', { pat_id: pat_id, breakfast: breakfast, lunch: lunch, supper: supper})
    .then(res=>{
      this.setData({
        hiddenTimeModal: true
      });
      wx.showToast({
        icon: "none",
        title: "饭店时间设置成功"
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
  // wx.showToast({
  //   icon: "none",
  //   title: "触发长按事件"
  // })
  let radioitems = this.data.radioItems
  let index = e.currentTarget.dataset.index
  let pat_id = radioitems[index].pat_id
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
            // radioitems.splice(index, 1)
            // console.log(radioitems)
            // _this.setData({
            //   radioItems: radioitems
            // })
            _this.onLoad()
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



})