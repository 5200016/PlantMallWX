const app = getApp();
const util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        hiddenModal: true,
        haveAddress: false,
        addressInfo: {},
        productInfo: {},
        orderPayList: {},
        payPrice: 0,
        addressId: null,
        url: app.globalData.HOST + '/',

        modaltitle: "",
        addrinfo: [],
        province: 0,
        city: 0,
        area: 0,
        pid: 0,
        cid: 0,
        num: 0,
        info: [],
        pIcon: {},
        price: "¥",
        price_calc: 0,
        attr: "",
        mailprice: {},
        mailprice_calc: 0,
        form_id: "",
        cart: {},
        cart2: {},
        total: 0,
        totalOrigin: 0,
        totalPromPrice: 0,
        totalPromPriceOrigin: 0,
        totalPromScore: 0,
        showPromPrice: !1,
        couponTotal: 0,
        address_id: 0,
        paymsg: {},
        youhui: {},
        cuxao: [],
        carts: [],
        animationData: {},
        canPay: !1,
        doPaying: !1,
        hasUserInfo: !1,
        buyType: "",
        showModalStatus: !1,
        couponList: [],
        group: !1,
        shopId: 0,
        singleCoupon: "",
        payType: 1,
        hava_orno: !1,
        promotion_price: "",
        promotion_score: "",
        nonSeckill: !0
    },

    /**
     * 根据id查询地址信息
     */
    getAddressById: function(id){
        let url = '/address/' + id;
        app.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    haveAddress: true,
                    addressInfo: res.data
                })
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 根据id查询商品详情
     */
    getProductById: function(id){
        let url = '/product';
        let data = {
            id: id
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    productInfo: res.data
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 订单支付
     */
    btnPay: function (){
        let that = this;
        let url = '/pay';
        let data = {
            openid: wx.getStorageSync("openid"),
            userId: wx.getStorageSync("userId"),
            payPrice: this.data.payPrice,
            sell: this.data.orderPayList.sell,
            lease: this.data.orderPayList.lease,
            shoppingProductIdList: this.data.orderPayList.shoppingProductIdList,
            receiveAddressId: this.data.addressId
        };
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                wx.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success: function(e) {
                        if("requestPayment:ok" == e.errMsg){
                            that.finishPay(res.data.payNo)
                        }
                    },
                    fail: function() {
                        wx.navigateTo({
                            url: "/pages/user/order/list/index?status=0" ,
                        });
                    }
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    finishPay: function(payNo){
        let url = '/pay/finish';
        let data = {
            openid: wx.getStorageSync("openid"),
            userId: wx.getStorageSync("userId"),
            payPrice: this.data.payPrice,
            payNo: payNo,
            sell: this.data.orderPayList.sell,
            lease: this.data.orderPayList.lease,
            shoppingProductIdList: this.data.orderPayList.shoppingProductIdList,
            receiveAddressId: this.data.addressId
        };
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                wx.navigateTo({
                    url: "/pages/user/order/list/index?status=1" ,
                });
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let orderPayList = wx.getStorageSync("orderPayList");
        let leaseTotalPrice = orderPayList.lease.totalPrice;
        let sellTotalPrice = 0;
        for(let i = 0 ; i < orderPayList.sell.length ; i++){
            sellTotalPrice += orderPayList.sell[i].totalPrice;
        }

        let leaseNumber = 0;
        for(let i = 0 ; i < orderPayList.lease.productInfo.length ; i++){
            leaseNumber += orderPayList.lease.productInfo[i].number;
        }
        orderPayList.lease.number = leaseNumber;


        this.setData({
            buyType: 'buy',
            hidden: true,
            orderPayList: orderPayList,
            addressId: options.addressId,
            payPrice: leaseTotalPrice + sellTotalPrice
        });

        if(!util.isEmpty(options.addressId)){
            this.getAddressById(options.addressId);
        }

        if(!util.isEmpty(this.data.orderPayList.productId)){
            this.getProductById(this.data.orderPayList.productId);
        }

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
