Page({
  /* 页面的初始数据*/
  data: {
    patient:'张三'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    wx.request({
      url: 'http://www.danthology.cn/ezhan/api/test',
      header:{
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        //将获取到的json数据，存在叫list这个数组中
        that.setData({
          list:res.data,
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    })
  }
})