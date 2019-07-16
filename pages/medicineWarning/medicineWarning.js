const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {
    patient: '张三'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let pat_id = wx.getStorageSync('prePatId')
    app.fly.request(app.globalData.apiURL + 'getWarningInfo')
      .then(res => {
        this.setData({
          list: res.data.data
        })
      })
      .catch(err => {
        console.log(err)
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
                  app.fly.request(app.globalData.apiURL + 'confirmWarning', { pat_id: pat_id })
                    .then(res => {
                      list.splice(index, 1)
                      that.setData({
                        list: list
                      })
                    })
                    .catch(err=>{
                      console.log(err)
                    })   
                }else{
                    console.log('用户点击辅助操作')
                }
            }
        });
    },
})