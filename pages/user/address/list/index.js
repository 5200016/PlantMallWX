const app = getApp();
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        addressList: [],
        scrollHeight: 0,

        showType: 1
    },

    /**
     * 根据openid获取用户地址列表
     */
    getAddressList: function () {
        let url = '/address';
        let data = {
            openid: wx.getStorageSync("openid"),
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.addressList;
                for (let i = 0; i < res.data.content.length; i++){
                    data.push(res.data.content[i]);
                }
                this.setData({
                    hidden: true,
                    addressList: data,
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 设置默认地址
     */
    setDefaultAddress: function(id){
        this.setData({
            hidden: false
        });
        let url = '/address/status';
        let data = {
            openid: wx.getStorageSync("openid"),
            id: id
        };
        app.wxRequest('PUT', url, data, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    // 滚动事件，下滑加载页面
    lower: function () {
        let pageNum = this.data.pageNum;
        if(++pageNum <= this.data.totalPages){
            this.setData({
                pageNum: pageNum
            });
            this.getAddressList();
        }
    },

    upper: function() {
        this.setData({
            pageNum: 1,
            totalPages: 0,
            addressList: []
        });
        this.getAddressList();
    },

    /**
     * 设置默认地址按钮
     */
    radioChange: function(e) {
        this.setDefaultAddress(e.detail.value);
    },

    /**
     * 选择地址
     */
    choseAddress: function(e) {
        let addressId = e.currentTarget.dataset.id;
        wx.setStorageSync("addressListType", "");
        let currentPage = getCurrentPages();
        if (currentPage.length > 1) {
            let data = {
                addressId: addressId
            };
            currentPage[currentPage.length - 2].onLoad(data);
        }
        wx.navigateBack({
            delta: 1
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        new app.WeToast();
        let that = this;
        wx.getSystemInfo({
            success: function (a) {
                that.setData({
                    scrollHeight: a.windowHeight
                });
            }
        });

        if(!util.isEmpty(options.origin)){
            this.setData({
                origin: options.origin
            })
        }

        wx.setStorageSync("addressListType", "");
        if("chose" != wx.getStorageSync("addressListType") && options.act == "choose"){
            wx.setStorageSync("addressListType", "chose");
            this.setData({
                showType: 2
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getAddressList();
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
});
