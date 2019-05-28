const app = getApp();
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.HOST + '/',
        hidden: false,
        currentTab: -1,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        orderList: [],
        scrollHeight: 0,
        hiddenModal: true,
        modalTitle: '',
        modalConfirmText: '',
        modalCancelText: '',
        modalAct: '',
        modalOrderId: null,

        hiddenmore: !0,

        modaltitle: "",
        modalconfirmtext: "",
        modalcanceltext: "",
        modalact: "",
        modalordersn: "",
        page: 1,
        maxpage: 1,
        count: 0,
        list: [],

        doPaying: !1
    },

    tabFun: function(e) {
        let currentTab = this.data.currentTab,
            current = e.target.dataset.current;
        if(current != currentTab){
            this.setData({
                currentTab: current,
                pageNum: 1,
                pageSize: 5,
                totalPages: 0,
                totalElements: 0,
                orderList: []
            });
            this.getOrderList();
        }
    },

    modalConfirm: function(t) {
        let act = t.target.dataset.act,
            id = t.target.dataset.id;

        switch (act) {
            case "confirmOrder":
                this.confirmReceive(id);
                break;
            case "deleteOrder":
                this.deleteOrder(id);
                break;
        }
        this.setData({
            hiddenModal: true
        });
    },
    modalCancel: function() {
        this.setData({
            hiddenModal: true
        });
    },

    /**
     * 删除订单按钮事件
     */
    deleteBtn: function(e){
        this.setData({
            hiddenModal: false,
            modalTitle: "您是否删除此订单",
            modalConfirmText: "是",
            modalCancelText: "否",
            modalAct: "deleteOrder",
            modalOrderId: e.target.dataset.id
        });
    },

    /**
     * 删除订单
     */
    deleteOrder: function(id){

    },

    /**
     * 确认收货按钮事件
     */
    confirmBtn: function(e){
        this.setData({
            hiddenModal: false,
            modalTitle: "您是否确认收货",
            modalConfirmText: "是",
            modalCancelText: "否",
            modalAct: "confirmOrder",
            modalOrderId: e.target.dataset.id
        });
    },

    /**
     * 确认收货
     */
    confirmReceive: function(id){
        let url = '/order';
        let data = {
            id: id
        };
        app.wxRequest('PUT', url, data, (res) => {
            if (res.result) {
                app.optionToast(res.msg);
                this.setData({
                    pageNum: 1,
                    pageSize: 5,
                    totalPages: 0,
                    totalElements: 0,
                    orderList: []
                });
                this.getOrderList();
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 根据status查询订单
     */
    getOrderList: function(){
        let url = '/order';
        let data = {
            userId: wx.getStorageSync("userId"),
            status: this.data.currentTab,
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.orderList;
                for (let i = 0; i < res.data.content.length; i++){
                    data.push(res.data.content[i]);
                }
                this.setData({
                    hidden: true,
                    orderList: data,
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

    // 滚动事件，下滑加载页面
    lower: function () {
        let pageNum = this.data.pageNum;
        if(++pageNum <= this.data.totalPages){
            this.setData({
                pageNum: pageNum
            });
            this.getOrderList();
        }
    },
    upper: function() {
        this.setData({
            pageNum: 1,
            totalPages: 0,
            orderList: []
        });
        this.getOrderList();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.getSystemInfo({
            success: function(t) {
                that.setData({
                    scrollHeight: t.windowHeight
                });
            }
        });
        if(!util.isEmpty()){
            this.setData({
                currentTab: options.status
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getOrderList();
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
