import { request } from "../../request/index"
Page({
  /*
  用户上拉页面到底部时 触发下一页数据
  2判断还有没有下一页的数据
  总页数  = (总条数 / 页面容量)
  3假如没有下一页数据 弹出提示 
  要是还有下一页数据就申请下一页数据
  */
  data: {
    Page: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 请求接口要的数据
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList()
  },
  // 请求商品列表的数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // 总条数
    const total = res.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      // 拼接数组  
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // console.log(this.data.goodsList);
    // 关闭下拉刷新窗口  没有调用下拉刷新直接关闭也没有影响
    wx.stopPullDownRefresh();

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 重新发送请求  页面要变为1
   */
  onPullDownRefresh: function () {
    // 1.重置数组
    this.setData({
      goodsList: []
    });
    // 2.页面重置为1
    this.QueryParams.pagenum = 1
    this.getGoodsList();
    // 3.手动关闭等待效果
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 1.判断有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '暂无其他数据',
      });

    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
})