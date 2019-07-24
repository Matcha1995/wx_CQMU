const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let pat_id = wx.getStorageSync('prePatId')
    app.fly.request(app.globalData.apiURL + 'getWarningInfo')
      .then(res => {
        console.log(res.data.data)
        if(res.data.data == ''){
          wx.showToast({
            icon: "none",
            title: "无服药告警信息"
          }) 
        }else{
          this.setData({
            list: res.data.data
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      console.log(this.data)
      this.onSocketMessage()
      // console.log("123456")
  },
  // onShow:function(){
  //   app.globalData.callback = function (msg) {
  //       console.log(msg)
  //   }
  // },



  openConfirm: function (e) {
    console.log(e)
    let that = this
    let list = this.data.list
    let index = e.currentTarget.dataset.index
    let pat_id = list[index].pat_id
    let drug_name = list[index].drug_name
    console.log(index)
    console.log(list)
    console.log(pat_id)
        wx.showModal({
            title: '告警确认',  
            content: '是否确认该条告警信息？',
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                  app.fly.request(app.globalData.apiURL + 'confirmWarning', { pat_id: pat_id, drug_name: drug_name})
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
  onSocketMessage: function (e) {
    // let that = this
    // console.log("该函数被调用")

    // console.log(that.data)
    // console.log(that.data.patient)
    // console.log(that.data.list)
    // console.log(list)
    let _this = this
    app.globalData.callback = function (msg) {
      console.log(msg)
      _this.setData({
        list: msg
      })
    }
  },
})