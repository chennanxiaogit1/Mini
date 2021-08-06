/*
1 页面加载时
 (1)从缓存中获取数据  渲染到页面中
  这些数据的checked = true
2 微信支付
(1)只有企业账号才可以实现微信支付功能
(2)企业账号的小程序后台中 必须给开发者添加
3 支付按钮
(1) 先判断缓存中是否有token值
(2) 没有就跳转到授权页面  
4有token值创建订单  获取订单编号
 */

import { request } from "../../request/index"

Page({
  data: {
    cart: [],
    address: {},
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    cart = cart.filter(item => item.checked)
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((item) => {
      if (item.checked) {
        totalNum += item.num;
        totalPrice += item.num * item.goods_price;
      }
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })

  },
  async handleOrderPay() {
    // 判断是否有token值
    let token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    token = wx.getStorageSync("token");
    // 创建订单
    const header = { Authorization: token };
    // 请求参数
    const ordder_price = this.data.totalPrice;
    const consignee_addr = this.data.address;
    const goods = [];
    this.data.cart.forEach(item => goods.push(
      {
        goods_id: item.goods_id,
        goods_number: item.num,
        goods_price: item.goods_price
      }
    ))
    console.log(await request({
      url: "/my/orders/create",
      data: { ordder_price, consignee_addr, goods },
      method: "POST",
      header
    }));
  },
})