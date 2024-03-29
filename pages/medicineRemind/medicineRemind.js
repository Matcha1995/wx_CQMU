const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {
    pat_name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pat_id = wx.getStorageSync('prePatId')
      app.fly.request(app.globalData.apiURL + 'getRemindInfo', { pat_id: pat_id })
        .then(res => {
          let pat_name = pat_id + ' - ' + res.data.pat_name;
          if(res.data.data == ''){
            this.setData({
              pat_name: pat_name
            })
            wx.showToast({
              icon: "none",
              title: "暂无开药提醒信息"
            })
            
          }else{
            this.setData({
              list: res.data.data,
              pat_name: pat_name
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
  }
})