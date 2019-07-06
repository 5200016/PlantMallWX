const app = getApp();
const util = require("../../../utils/util.js");
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
        taskList: [],
        dateArray: [],
        scrollHeight: 0
    },

    getLocalImage : function(e){
        let that = this;
        let time = e.currentTarget.dataset.time;
        let orderId = e.currentTarget.dataset.orderId;
        wx.chooseImage({
            count:1,
            success:function(res){
                let filePath=res.tempFilePaths[0];
                that.setData({
                    hidden: false
                });
                wx.uploadFile({
                    url: app.globalData.HOST + '/mall' + '/file/ordinary',
                    filePath: filePath,
                    name: 'file',
                    success:function(response){
                        let info = JSON.parse(response.data)
                        if(info.result){
                            that.insertMaintenance(orderId, time, info.data.url);
                        }else {
                            app.optionToast(response.data.msg);
                        }
                    }
                })
            },
            fail:function(error){
                console.error("调用本地相册文件时出错")
                console.warn(error)
            },
            complete:function(){

            }
        })
    },

    insertMaintenance: function(orderId, time, picture){
        let url = '/maintenance/time';
        let data = {
            orderId: orderId,
            time: time,
            url: picture
        };
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                this.upper();
            } else {
                this.setData({
                    hidden: true
                });
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    getTaskList: function () {
        let url = '/user/maintenance';
        let data = {
            userId: wx.getStorageSync("userId"),
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.taskList;
                for (let i = 0; i < res.data.content.length; i++) {
                    let dateArray = res.data.content[i].order.maintenanceTime.split(',');
                    let finishArray = res.data.content[i].finish;
                    res.data.content[i].order.dateArray = this.getDateArray(dateArray, finishArray);
                    data.push(res.data.content[i].order);
                }
                this.setData({
                    hidden: true,
                    taskList: data,
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

    getDateArray: function(dateArray, finishArray){
        let result = [];
        for(let i = 0 ; i < dateArray.length ; i ++){
            let finish = false;
            for(let j = 0 ; j < finishArray.length ; j ++){
                if(dateArray[i] == finishArray[j].time){
                    finish = true;
                }
            }
            let data = {
                time: dateArray[i],
                finish: finish
            };
            result.push(data);
            finish = false;
        }
        return result;
    },

    // 滚动事件，下滑加载页面
    lower: function () {
        let pageNum = this.data.pageNum;
        if(++pageNum <= this.data.totalPages){
            this.setData({
                pageNum: pageNum
            });
            this.getTaskList();
        }
    },
    upper: function() {
        this.setData({
            pageNum: 1,
            totalPages: 0,
            taskList: []
        });
        this.getTaskList();

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        this.getTaskList();
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
