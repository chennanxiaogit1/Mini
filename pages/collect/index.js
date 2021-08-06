// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Page: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      }
    ],
    collect: []
  },

  // 监听点击事件
  titletap(e) {
    // 1.获取点击的标题索引
    const index = e.detail;
    // 2.修改数组
    let { Page } = this.data
    Page.forEach((item, i) => {
      item.isActive = false;
      if (i === index) item.isActive = true;
    })
    this.setData({
      Page
    })
  },
  onShow: function () {
    // 1.获取商品收藏数据
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })

  }
})