const app = getApp();
const util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.HOST + '/',
        hidden: false,
        pageNum: 1,
        pageSize: 8,
        totalPages: 0,
        totalElements: 0,
        commentList: [],
        scrollHeight: 0,
        id: null
    },

    getReviewList: function(id){
        let url = '/review/page';
        let data = {
            id: id,
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.commentList;
                for (let i = 0; i < res.data.content.length; i++){
                    res.data.content[i].createTime = util.formatTime(new Date(res.data.content[i].createTime));
                    data.push(res.data.content[i]);
                }
                this.setData({
                    hidden: true,
                    commentList: data,
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
            this.getReviewList(this.data.id);
        }
    },
    upper: function() {
        this.setData({
            pageNum: 1,
            totalPages: 0,
            commentList: []
        });
        this.getReviewList(this.data.id);
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

        let id = options.id;
        if(!util.isEmpty(id)){
            this.setData({
                id: id
            });
            this.getReviewList(id);
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
