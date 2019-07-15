Page({
  /* 页面的初始数据*/
  data: {
    patient: '张三'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'http://www.danthology.cn/ezhan/api/test',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //将获取到的json数据，存在叫list这个数组中
        that.setData({
          list: res.data,

          //res代表success函数的事件对，data是固定的，list是数组
        })
        console.log(res.data)
      }
    })
  },

  openConfirm: function (e) {
    console.log(e)
    var that = this
    var list = this.data.list
    var index = e.currentTarget.dataset.index
    console.log(index)
    console.log(list)
    wx.showModal({
      title: '告警确认',
      content: '是否确认该条告警信息？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          // console.log(index)
          list.splice(index, 1)
          that.setData({
            list: list
          })
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },
})