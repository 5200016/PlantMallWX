const app = getApp(),
    wxParse = require("../../../utils/wxParse/wxParse.js");
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
                if(this.data.classifyType === 0){
                    this.setData({
                        hidden: true,
                        info: res.data,
                        price: res.data.price,
                        totalPrice: res.data.price,
                        inventory: res.data.inventory
                    });
                }
                if(this.data.classifyType === 1){
                    this.setData({
                        hidden: true,
                        info: res.data,
                        price: res.data.leasePrice,
                        totalPrice: res.data.leasePrice,
                        inventory: res.data.inventory
                    });
                }

                wxParse.wxParse("article", "html", res.data.description, this, 5);
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 购买、购物车弹窗显示
     */
    setModalStatus: function (e) {
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
        let url = "../../cart/order/index",
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

        switch (classifyType) {
            case 0:
                let info = {
                    productId: this.data.info.id,
                    productInfo: this.data.info,
                    classifyType: classifyType,
                    number: this.data.number,
                    totalPrice: this.data.totalPrice,
                };
                data.sell.push(info);
                break;
            case 1:
                let product = this.data.info;
                product.number = this.data.number;
                let productList = {
                    productId: product.id,
                    productNumber: product.number
                };
                data.lease.productList.push(productList);
                data.lease.productInfo.push(product);
                data.lease.classifyType = 1;
                data.lease.totalPrice = this.data.totalPrice;
                data.lease.number = this.data.number;
                break;
        }
        wx.setStorageSync("orderPayList", data);
        wx.navigateTo({
            url: url
        });
    },

    getReviewList: function(id){
        let url = '/review';
        let data = {
            id: id
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                this.setData({
                    count: res.data.length,
                    commentInfo: res.data[0]
                })
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
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
        this.getReviewList(options.id);
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
