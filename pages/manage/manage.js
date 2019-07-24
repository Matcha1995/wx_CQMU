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