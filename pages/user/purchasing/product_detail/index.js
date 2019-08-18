const app = getApp(),
    wxParse = require("../../../../utils/wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.HOST + '/',
    hidden: false,
    id: null,
    info: {},
    collect: false,
    btnType: "",
    canSetNumber: true,
    number: 1,
    price: 0,
    totalPrice: 0,
    inventory: 0,
    classifyType: null,
    phone: '',
    count: 0,
    commentInfo: {},
    purchaseFreight: 0,
    purchasePrice: 0,
    purchaseService: 0,

    num1: [1, 2, 3, 4, 5],
    num2: [1, 2, 3],
    num3: [1, 2],

    // 轮播图参数
    indicatorDots: true,
    autoplay: false,
    interval: 5e3,
    duration: 1e3,
  },

  /**
   * 根据id获取商品详情
   */
  getProductById: function (id) {
    let url = '/product';
    let data = {
      id: id
    };
    app.wxRequest('GET', url, data, (res) => {
      if (res.result) {
        this.setData({
          hidden: true,
          info: res.data,
          price: res.data.purchasePrice,
          totalPrice: res.data.purchasePrice,
          purchaseFreight: res.data.purchaseFreight,
          purchaseService: res.data.purchaseService,
          inventory: res.data.inventory
        });
        wxParse.wxParse("article", "html", res.data.description, this, 5);
      } else {
        app.optionToast(res.msg);
      }
    }, (err) => {
      console.log(err.data);
    });
  },

  checkInput: function(e){
    let number = parseInt(e.detail.value);
    let price = this.data.price;
    let totalPrice = this.countTotalPrice(price, number);
    this.setData({
      number: number,
      totalPrice: totalPrice ? totalPrice : 0
    });
  },

  /**
   * 购买、购物车弹窗显示
   */
  setModalStatus: function (e) {

    switch (this.data.classifyType) {
      case 0:
        this.setData({
          number: 1
        });
        break;
      case 1:
        this.setData({
          number: 30
        });
        break;
    }

    let price = this.data.price,
        number = this.data.number;
    let totalPrice = this.countTotalPrice(price, number);
    this.setData({
      totalPrice: totalPrice
    });

    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });

    animation.translateY(300).step(), this.setData({
      animationData: animation.export()
    }), 1 == e.currentTarget.dataset.status && this.setData({
      showModalStatus: true,
    }), setTimeout(function () {
      animation.translateY(0).step(), this.setData({
        animationData: animation
      }), 0 == e.currentTarget.dataset.status && this.setData({
        showModalStatus: false
      });
    }.bind(this), 200);
  },

  /**
   * 数量减
   */
  bindMinus: function () {
    if (this.data.canSetNumber) {
      let price = this.data.price,
          number = this.data.number;
      if (--number > 0) {
        let totalPrice = this.countTotalPrice(price, number);
        this.setData({
          number: number,
          totalPrice: totalPrice
        });
      }
    }
  },

  /**
   * 数量加
   */
  bindPlus: function () {
    if (this.data.canSetNumber) {
      let price = this.data.price,
          number = this.data.number,
          inventory = this.data.inventory;
      if(number < inventory){
        number++;
      }
      let totalPrice = this.countTotalPrice(price, number);
      this.setData({
        number: number,
        totalPrice: totalPrice
      });
    }
  },

  /**
   * 数量减
   */
  bindMinusLease: function () {
    if (this.data.canSetNumber) {
      let price = this.data.price,
          number = this.data.number;
      if (--number >= 30) {
        let totalPrice = this.countTotalPrice(price, number);
        this.setData({
          number: number,
          totalPrice: totalPrice
        });
      }
    }
  },

  /**
   * 数量加
   */
  bindPlusLease: function () {
    if (this.data.canSetNumber) {
      let price = this.data.price,
          number = this.data.number;
      number++;
      let totalPrice = this.countTotalPrice(price, number);
      this.setData({
        number: number,
        totalPrice: totalPrice
      });
    }
  },

  /**
   * 计算总价
   * @param t 价格
   * @param a 数量
   * @returns {number}
   */
  countTotalPrice: function(t, a){
    let e = 0,
        i = t.toString(),
        s = a.toString();
    try {
      e += i.split(".")[1].length;
    } catch (t) {}
    try {
      e += s.split(".")[1].length;
    } catch (t) {}
    return Number(i.replace(".", "")) * Number(s.replace(".", "")) / Math.pow(10, e);
  },

  /**
   * 确定购买
   */
  confirmPay: function(){
    let url = "../product_pay/index",
        classifyType = this.data.classifyType;
    // 购物车数据模板
    let data = {
      sell: [],
      lease: {
        productList: [],
        productInfo: [],
        classifyType: 1,
        totalPrice: 0,
      },
      shoppingProductIdList: []
    };

    if(this.data.number < 1){
      wx.showToast({
        title: "购买数量不能小于1",
        icon: 'none'
      });
      setTimeout(() => {
        wx.hideToast()

      }, 1500)
      return;
    }
    let info = {
      productId: this.data.info.id,
      productInfo: this.data.info,
      classifyType: classifyType,
      number: this.data.number,
      totalPrice: this.data.totalPrice + this.data.purchaseService + this.data.purchaseFreight,
    };
    data.sell.push(info);

    wx.setStorageSync("orderPayList", data);
    wx.navigateTo({
      url: url
    });
  },

  /**
   * 打电话
   */
  calling: function(e) {
    let phone = e.target.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function() {
        console.log("拨打电话成功！");
      },
      fail: function() {
        console.log("拨打电话失败！");
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      classifyType: parseInt(options.classifyType),
      scrollHeight: wx.getStorageSync("scrollHeight"),
      phone: wx.getStorageSync("phone")
    });
    this.getProductById(options.id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
