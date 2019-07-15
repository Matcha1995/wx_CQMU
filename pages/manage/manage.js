Page({
  /* 页面的初始数据*/
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //跳转到服药详情页面
  toDetail:function(){
    wx.navigateTo({
      url: '../medicineDetail/medicineDetail',
    })
  },
  //跳转到告警详情页面
  toWarning: function () {
    wx.navigateTo({
      url: '../medicineWarning/medicineWarning',
    })
  },
  //跳转到开药提醒页面
  toRemind: function () {
    wx.navigateTo({
      url: '../medicineRemind/medicineRemind',
    })
  },
  //跳转到历史页面
  toHistory:function(){
    wx.navigateTo({
      url: '../historyManage/historyManage',
    })
  }
})