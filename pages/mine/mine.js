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

    // // 设定饭点时间的数据
    // showTimeView: false,
    // showTimeImage: true,

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
      console.log(res.data.data)
      this.setData({
        radioItems: res.data.data,
      })
    })
    .catch(err => { });
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
  console.log('radio发生change事件，携带value值为：', e.detail.value);
  var radioItems = this.data.radioItems;
  for (var i = 0, len = radioItems.length; i < len; ++i) {
    // 将所有元素遍历出来，等到点击单选按钮时，当value值与遍历变量一致的时候就把checked设置为true
    radioItems[i].checked = radioItems[i].id == e.detail.value;
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
  //获取输入框中输入的值
  getID: function (e) {
    this.setData({
      id: e.detail.value
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
    var _this = this
    // console.log(e)
    var id = this.data.id;
    console.log(this.data.id)
    app.fly.request(app.globalData.apiURL + 'bindPatId',{pat_id:id})
      .then(res=>{
          let radioitems = res.data.data
          console.log(radioitems)
          _this.setData({
            hiddenmodalput: true,
            radioItems: radioitems,
          })
      })
      .catch(err=>{
        console.log(err)
      });
  },



//点击隐藏或者显示联系人列表
showTel:function(){
  var that = this;
  wx.request({
    url: 'https://danthology.cn/ezhan/api/test',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      var length = res.data.length
      //将获取到的json数据，存在叫list这个数组中
      that.setData({
        list: res.data,
        //res代表success函数的事件对，data是固定的，list是数组
        showLinkView: (!that.data.showLinkView),
        showLinkImage: (!that.data.showLinkImage)
      })
    }
  })
},
//点击“添加更多”进行联系人绑定
addTel:function(e){
  var len = this.data.list.length
  if(len >= 4){
    wx.showModal({
      content: '最多只能添加三个联系人！',
      showCancel: false,
      success:function(res){
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }
  else{
    this.setData({
      hiddenTelModal: !this.data.hiddenTelModal
    })
  }
},
//取消按钮  
telCancel: function () {
  this.setData({
    hiddenTelModal: true
  });
},
//确认按钮  
telConfirm: function () {
  var telephone = this.data.id;
  console.log(telephone);
  this.setData({
    hiddenTelModal: true
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
  var id=this.data.id;
  console.log(id);
  this.setData({
    hiddenTimeModal: true
  })
},

//选择早饭时间
bindBreakfastTime:function(e){
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

})