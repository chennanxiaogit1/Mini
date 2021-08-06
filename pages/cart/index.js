/*
1 获取用户的地址
  (1)绑定点击事件
  (2)调用小程序内置的api 获取用户的收货地址
2 将地址存入缓存中
3 onShow获取购物车中的缓存数据
（0）回到了商品的详细页面 第一次添加商品时 添加默认属性 checked:true
（1）获取缓存中的购物车数组
（2）将购物车数组的数据渲染到页面中
4 全选按钮
 (1)获取购物车中的商品数据
 (2)根据购物车中的商品数据 只要有一个没有被选中 全选按钮就不能被选中
5  总价格和总数量
 (1)获取购物车数据 然后将选中的商品拿出来
 (2)将其遍历 总数量num 总价格= num * price 
 (3)最终将其设置回数组中
6 商品的选中
 (1)绑定change事件
 (2)获取修改的商品
 (3)将该商品对象的选中状态 取反
 (4)重新填回到data数据中去
7 全选和反选
 (1)全选复选框绑定事件 change 
 (2) 获取 data中全选变量 allchecked 然后取反
 (3)购物车商品所有商品根据 allchecked改变
8 商品数量的编辑
 (1)"+""-" 按钮 绑定一个点击事件 区分的关键时参数
 (2)传递被点击的商品的goods_id
 (3)直接修改商品对象的num
 当num为1是 用户据点击 "-1"时 弹出一个弹框提示(showModal) 询问用户 是否要删除
 确认 就执行删除 取消就什么都不做
 (4)将修改的重新设置data和wx中
9 点击结算
 (1)判断有没有收货地址
 (2)判断有没有商品
 (3)经过以上的验证跳转到支付页面
 */

import { showModal, showToast } from "../../request/index"

Page({
  data: {
    cart: [],
    address: {},
    allchecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 点击按钮触发的获取地址事件
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        const address = result;
        // 5.地址存入缓存
        wx.setStorageSync("address", address);
      },
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ address })
    this.setCart(cart)

  },
  // 商品按钮
  handleItem(e) {
    // 获取购物车 和 商品的id
    let cart = wx.getStorageSync("cart") || [];
    let goods_id = e.currentTarget.dataset.id;
    let index = cart.findIndex(item => item.goods_id == goods_id)
    // 选出的商品 checked取反 
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车的状态 数量 价格 全选 。。。
  setCart(cart) {
    // 判断全选按钮是否选中
    let allchecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((item) => {
      if (item.checked) {
        totalNum += item.num;
        totalPrice += item.num * item.goods_price;
      } else {
        allchecked = false
      }
    })
    // 判断购物车是否为空
    allchecked = cart.length == 0 ? false : allchecked
    this.setData({
      cart,
      allchecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  },
  // 全选按钮的改变
  handleItemAll() {
    // 1.获取data中的数据
    let { allchecked, cart } = this.data
    // 2.修改数据
    allchecked = !allchecked;
    cart.map(item => item.checked = allchecked);
    this.setCart(cart);
  },
  // 商品的编辑
  async handleItemNumEdit(e) {
    let { cart } = this.data;
    let { id, operation } = e.currentTarget.dataset;
    // 找出修改的商品
    let index = cart.findIndex(item => item.goods_id == id)
    // 对商品的数量进行编辑
    // 判断是否要执行删除
    if (operation == -1 && cart[index].num == 1) {
      // 弹出提示框
      const result = await showModal({ content: "你是否要删除" });
      if (result.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }

    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 结算按钮
  async handlePay() {
    let { address, cart } = this.data;
    // 1.判断收货地址
    if (!address.userName) {
      await showToast({ title: "还没有添加收货地址" })
    }
    // 2.判断用户是否选购商品
    else if (this.data.totalNum == 0) {
      await showToast({ title: "还没有选购商品" })
    }
    // 3.跳转到支付页面
    else {
      wx.navigateTo({
        url: '/pages/pay/index',
        success: (result) => {

        },
      });

    }
  }
})