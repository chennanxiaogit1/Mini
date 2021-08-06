// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 被收藏的商品
    collectNum: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");
    // 获取被收藏商品的数量
    const collect = wx.getStorageSync("collect");

    this.setData({
      userInfo,
      collectNum: collect.length
    })

  },

})