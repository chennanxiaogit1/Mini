import { request, showToast } from "../../request/index"
/*
点击  加入购物车
1先绑定点击加入购物车事件
2获取缓存中的购物车数据  数据格式化
3先判断 当前商品是否已经存在
若商品存在 修改购物车的数据 商品num++ 重加加入购物车的数据中
若商品不存在 修改购物车数据 添加该商品 同时带上购买的属性
4弹窗提示
5商品收藏
 1页面onShow的时候，加载缓存中的商品收藏数据
 2判断当前商品是不是被收藏了 来改变图标
 3点击商品的收藏按钮来改变商品是否被收藏状态
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: [],
    isCollect: false
  },
  // 商品的信息
  GoodsInfo: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let CurrentPages = pages[pages.length - 1];
    let options = CurrentPages.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品的详细信息
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;
    // 1.获取缓存中收藏的商品数据
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断商品是否被收藏
    let isCollect = collect.some(item => item.goods_id == this.GoodsInfo.goods_id);
    this.setData({
      // 用到的数据较少 减少小程序的负载
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone手机 不能识别webp图片格式
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击图片放大
  handletap(e) {
    // 1.先构造要预览的图片数组
    const urls = this.data.goodsObj.pics.map(item => item.pics_mid);
    let { index } = e.currentTarget.dataset

    wx.previewImage({
      current: urls[index],
      urls
    });

  },
  // 加入购物车
  handleCartAdd() {
    // 1.获取缓存的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断该商品数据是否存在
    console.log(this.GoodsInfo);
    let index = cart.findIndex(v => v.goods_id == this.GoodsInfo.goods_id)
    if (index == -1) {
      // 没有该商品
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 已经有该商品
      cart[index].num++;
    }
    // 重新添加到购物车中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({
      title: '添加购物车成功',
      mask: true,
    });

  },
  // 商品的收藏与否
  async handleCollect() {
    let isCollect = false;
    // 1.从缓存中取到收藏的商品
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断该商品是否收藏了
    let index = collect.findIndex(item => item.goods_id == this.GoodsInfo.goods_id);
    if (index != -1) {
      collect.splice(index, 1);
      isCollect = false;
      await showToast({ title: "取消收藏" })
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      await showToast({ title: "收藏成功" })
    }
    // 3.将商品存回缓存中
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  },
})