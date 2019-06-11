const app = getApp();
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: !0,
        url: app.globalData.HOST + '/',
        orderInfo: {}
    },

    getOrderInfo: function (orderId) {
        let url = '/order/id';
        let data = {
            orderId: orderId,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = res.data;
                data.createTime = util.formatTime(new Date(data.createTime));
                this.setData({
                    hidden: true,
                    orderInfo: data,
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    bindKeyInput: function(e) {
        let productIndex = e.currentTarget.dataset.index,
            value = e.detail.value;

        let orderInfo = this.data.orderInfo;
        let review = {
            content: value,
            productId: orderInfo.orderProducts[productIndex].product.id
        };
        orderInfo.orderProducts[productIndex].review = review;
        this.setData({
            info: orderInfo
        });
    },

    save: function(){
        let orderInfo = this.data.orderInfo;
        let orderProducts = orderInfo.orderProducts;

        let reviewInfo = {
            orderId: orderInfo.id,
            userId: wx.getStorageSync("userId"),
            data: []
        };

        for(let item in orderProducts){
            let review = {
                productId: orderProducts[item].review.productId,
                content: orderProducts[item].review.content
            };
            reviewInfo.data.push(review);
        }

        let url = '/review';
        let data = reviewInfo;
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                wx.navigateTo({
                    url: '/pages/user/order/list/index?status=3'
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(!util.isEmpty(options.orderId)){
            this.getOrderInfo(options.orderId)
        }else {
            this.setData({
                hidden: true
            })
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
