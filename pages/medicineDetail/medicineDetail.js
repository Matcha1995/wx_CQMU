const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {
    // patient:'张三'
    pat_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('prePatId'))
    let pat_id = wx.getStorageSync('prePatId')
    app.fly.request(app.globalData.apiURL + 'getPrevious', { pat_id: pat_id })
      .then(res=>{
        console.log(res.data.data)
        console.log(res.data.pat_name)
        this.setData({
          list: res.data.data,
          pat_name: res.data.pat_name
        })
      })
      .catch(err=>{
        console.log(err)
      })
  }
})