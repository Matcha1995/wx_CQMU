Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let title = options.title
    let content = options.content
    console.log(options)
    console.log(title)
    console.log(content)
    this.setData({
      title:title,
      content:content
    })
  },

})