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
        payPrice: 0.00,
        addressId: null,
        url: app.globalData.HOST + '/',
        animationData: {},
        showModalStatus: false,
        couponList: [],
        couponName: '',
        couponPrice: 0.00,
        couponId: null,
        checked: false,

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

        canPay: !1,
        doPaying: !1,
        hasUserInfo: !1,
        buyType: "",

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
     * 租赁合同已阅勾选操作
     */
    toAgreement() {
        wx.navigateTo({
            url: '/pages/cart/agreement/index'
        })
    },

    checkboxChange(e) {
        if (e.detail.value !== []){
            this.setData({
                checked: true
            })
        }else{
            this.setData({
                checked: false
            })
        }
    },

    /**
     * 订单支付
     */
    btnPay: function (){
        if(util.isEmpty(this.data.addressId)){
            wx.showToast({
                title: "请选择地址",
                icon: 'none'
            });
            setTimeout(() => {
                wx.hideToast()

            }, 1500)
            return;
        }

        if (this.data.checked !== true) {
            wx.showToast({
                title: "请阅读协议并勾选",
                icon: 'none'
            });
            setTimeout(() => {
                wx.hideToast()

            }, 1500)
            return;
        }

        let that = this;
        let url = '/pay';
        let data = {
            openid: wx.getStorageSync("openid"),
            userId: wx.getStorageSync("userId"),
            payPrice: this.data.payPrice,
            leaseCouponId: this.data.couponId,
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

    selectCoupon: function(e){
        let that = this;
        let id = e.currentTarget.dataset.id,
            name = e.currentTarget.dataset.name,
            value = e.currentTarget.dataset.value;
        let animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        animation.translateY(300).step(), this.setData({
            animationData: animation.export()
        }), setTimeout(function () {
            animation.translateY(0).step(), this.setData({
                animationData: animation,
                showModalStatus: false
            });
        }.bind(this), 200);

        this.setData({
            couponId: id,
            couponName: name,
            couponPrice: value
        })
    },

    setModalStatus: function (e) {
        if(util.isEmpty(this.data.addressId)){
            wx.showToast({
                title: "请选择地址",
                icon: 'none'
            });
            setTimeout(() => {
                wx.hideToast()

            }, 1500)
            return;
        }
        let productPrice = e.currentTarget.dataset.price;
        this.setData({
            couponList: []
        });
        let url = '/coupon/order';
        let data = {
            userId: wx.getStorageSync("userId")
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.couponList;
                for (let i = 0; i < res.data.length; i++){
                    res.data[i].coupon.startTime = util.formatTimeYMD(new Date(res.data[i].coupon.startTime));
                    res.data[i].coupon.endTime = util.formatTimeYMD(new Date(res.data[i].coupon.endTime));
                    res.data[i].coupon.productPrice = productPrice;
                    data.push(res.data[i].coupon);
                }
                this.setData({
                    couponList: data
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });

        let animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        animation.translateY(300).step(), this.setData({
            animationData: animation.export()
        }), 1 == e.currentTarget.dataset.status && this.setData({
            showModalStatus: true
        }), setTimeout(function () {
            animation.translateY(0).step(), this.setData({
                animationData: animation
            }), 0 == e.currentTarget.dataset.status && this.setData({
                showModalStatus: false
            });
        }.bind(this), 200);
    },
    hideCoupon: function (e) {
        let animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        animation.translateY(300).step(), this.setData({
            animationData: animation.export()
        }), setTimeout(function () {
            animation.translateY(0).step(), this.setData({
                animationData: animation,
                showModalStatus: false
            });
        }.bind(this), 200);
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

        let addressId = options.addressId;
        if(util.isEmpty(addressId)){
            addressId = null;
        }

        this.setData({
            buyType: 'buy',
            hidden: true,
            orderPayList: orderPayList,
            addressId: addressId,
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
