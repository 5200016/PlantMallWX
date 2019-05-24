const app = getApp();
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        hiddenMore: true,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        appointmentList: [],
        scrollHeight: 0,
        currentTab: 0,

        hiddenModal: true,
        modalTitle: "",
        modalConfirmText: "",
        modalCancelText: "",
        modalAct: "",
        modalAppointmentId: ""
    },

    /**
     * 切换选项卡
     */
    tabFunction: function (t) {
        let lastCurrentTab = this.data.currentTab, currentTab = t.target.dataset.current;
        if(currentTab != lastCurrentTab){
            this.setData({
                currentTab: currentTab,
                pageNum: 1,
                pageSize: 5,
                totalPages: 0,
                totalElements: 0,
                appointmentList: [],
            })
        }
        this.getAppointmentLis(currentTab);
    },

    upper: function () {
        this.setData({
            hidden: false,
            pageNum: 1,
            pageSize: 5,
            totalPages: 0,
            totalElements: 0,
            appointmentList: []
        });
        this.getAppointmentLis(this.data.currentTab);
    },
    lower: function (t) {
        let pageNum = this.data.pageNum;
        if(++pageNum <= this.data.totalPages){
            this.setData({
                pageNum: pageNum,
                hiddenMore: false
            });
            this.getAppointmentLis(this.data.currentTab);
        }
    },

    /**
     * 根据状态获取预约列表
     */
    getAppointmentLis: function(status){
        let url = '/user/appointment';
        let data = {
            openid: wx.getStorageSync("openid"),
            status: status,
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.appointmentList;
                for (let i = 0; i < res.data.content.length; i++){
                    let time = res.data.content[i].time;
                    res.data.content[i].time = util.formatTime(new Date(time));
                    data.push(res.data.content[i]);
                }
                this.setData({
                    hidden: true,
                    appointmentList: data,
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
     * 编辑预约状态
     * @param id 预约订单id
     * @param status 预约状态
     */
    editAppointmentStatus: function(id, status){
        let url = '/appointment/status';
        let data = {
            id: id,
            status: status,
        };
        app.wxRequest('PUT', url, data, (res) => {
            if (res.result) {
                this.upper();
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 取消预约
     */
    cancel_btn: function (e) {
        this.setData({
            hiddenModal: false,
            modalTitle: "您是否取消预约?",
            modalConfirmText: "是",
            modalCancelText: "否",
            modalAct: "cancel",
            modalAppointmentId: e.target.dataset.id
        });
    },

    /**
     * 确认处理
     */
    confirm_btn: function (e) {
        this.setData({
            hiddenModal: false,
            modalTitle: "您是否确认处理?",
            modalConfirmText: "是",
            modalCancelText: "否",
            modalAct: "confirm",
            modalAppointmentId: e.target.dataset.id
        });
    },

    /**
     * 弹窗确认操作
     */
    modalConfirm: function (e) {
        let act = e.target.dataset.act;
        let appointmentId = e.target.dataset.id;
        switch(act){
            case "cancel":
                this.editAppointmentStatus(appointmentId, 2);
                break;
            case "confirm":
                this.editAppointmentStatus(appointmentId, 1);
                break;
        }
        this.setData({
            hiddenModal: true
        });
    },
    /**
     * 弹窗取消操作
     */
    modalCancel: function () {
        this.setData({
            hiddenModal: !0
        });
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
        this.getAppointmentLis(this.data.currentTab);
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
