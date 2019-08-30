const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {
    //小红点提示
    hidden:true
    // num:null
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    

  },
  
  // 监听页面隐藏
  onHide:function(){
    console.log("页面隐藏")
  },

// 监听页面显示
  onShow:function(){

    //websocket断线重连
    if (!app.globalData.websocketStatus) {
      wx.connectSocket({
        url: 'wss://danthology.cn:8282'
      })
    }

    let that = this
    //获得未确认的告警信息
    app.fly.request(app.globalData.apiURL + 'getWarningInfo')
      .then(res=>{
        if(res.data.data != ''){
          console.log(res.data.data)
          let length = res.data.data.length
          let _this = this
          _this.setData({
            hidden:false
            // num:length
          })
        }else{
          this.setData({
            // num:null,
            hidden:true
          })
        }
      })

    // 在这个页面监听websocket发送过来的消息
    app.globalData.callback = function (msg){
      console.log(msg)
      that.setData({
        hidden:false
      })
    }
    
  },

  //跳转到服药详情页面
  toDetail:function(){
    let pat_id = wx.getStorageSync('prePatId')
    if (pat_id){
      wx.navigateTo({
        url: '../medicineDetail/medicineDetail',
      })
    }else{
      wx.showToast({
        icon: "none",
        title: "请先绑定患者！"
      })
    }
  },
  //跳转到告警详情页面
  toWarning: function () {
    let pat_id = wx.getStorageSync('prePatId')
    if (pat_id){
      wx.navigateTo({
        url: '../medicineWarning/medicineWarning',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: "请先绑定患者！"
      })
    }
  },
  //跳转到开药提醒页面
  toRemind: function () {
    let pat_id = wx.getStorageSync('prePatId')
    if (pat_id){
      wx.navigateTo({
        url: '../medicineRemind/medicineRemind',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: "请先绑定患者！"
      })
    }
  },
  //跳转到历史页面
  toHistory:function(){
    let pat_id = wx.getStorageSync('prePatId')
    if (pat_id){
      wx.navigateTo({
        url: '../historyManage/historyManage',
      })
    }else{
      wx.showToast({
        icon: "none",
        title: "请先绑定患者！"
      })
    }
  }
})