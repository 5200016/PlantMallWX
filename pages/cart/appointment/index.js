const app = getApp();

function isEmpty(value){
    if(value !== null && value !== "" && value !== undefined){
        return false
    }
    return true;
}

const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2019; i <= date.getFullYear() + 5; i++) {
    years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
    if (i < 10) {
        i = "0" + i;
    }
    months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
    if (i < 10) {
        i = "0" + i;
    }
    days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
    if (i < 10) {
        i = "0" + i;
    }
    hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
    if (i < 10) {
        i = "0" + i;
    }
    minutes.push("" + i);
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hiddenModal: true,
        modaltitle: "",
        haveAddress: false,
        addressId: null,
        time: '',
        multiArray: [years, months, days, hours, minutes],
        multiIndex: [0, 9, 16, 10, 17],
        choose_year: '',
        addressInfo: {},
        remark: '',
        tmpPath: '',

        pid: 0,
        num: 0,
        info: [],
        price: "¥",
        price_calc: 0,
        total: 0,
        addrinfo: [],
        address_id: 0,
        hasAddr: !1,
        hasEmptyGrid: !1,
        lda: "<",
        rxi: ">",
        showView: !1,
        weeks_ch: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        has_last_month: 0,
        has_next_month: 0,
        cur_year: "",
        cur_month: "",
        cur_day: "",
        cur_hours: "",
        cur_shopid: 0,
        cur_shopname: "--",
        cur_name: "",
        cur_mobile: "",
        picker_array: [],
        picker_index: 0,
        cur_mechanic: 0,
        showModalStatus: !1,
        couponList: [],
        singleCoupon: "",
        singleCouponId: 0,
        paymsg: "",
        doPaying: !1,
        form_id: "",
        modal: !0,
        mobile: ""
    },

    //获取时间日期
    bindMultiPickerChange: function(e) {
        this.setData({
            multiIndex: e.detail.value
        });
        const index = this.data.multiIndex;
        const year = this.data.multiArray[0][index[0]];
        const month = this.data.multiArray[1][index[1]];
        const day = this.data.multiArray[2][index[2]];
        const hour = this.data.multiArray[3][index[3]];
        const minute = this.data.multiArray[4][index[4]];
        this.setData({
            time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":00"
        })
    },

    //监听picker的滚动事件
    bindMultiPickerColumnChange: function(e) {
        //获取年份
        if (e.detail.column == 0) {
            let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
            this.setData({
                choose_year
            })
        }
        //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        if (e.detail.column == 1) {
            let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
            let temp = [];
            if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
                for (let i = 1; i <= 31; i++) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    temp.push("" + i);
                }
                this.setData({
                    ['multiArray[2]']: temp
                });
            } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
                for (let i = 1; i <= 30; i++) {
                    if (i < 10) {
                        i = "0" + i;
                    }
                    temp.push("" + i);
                }
                this.setData({
                    ['multiArray[2]']: temp
                });
            } else if (num == 2) { //判断2月份天数
                let year = parseInt(this.data.choose_year);
                console.log(year);
                if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
                    for (let i = 1; i <= 29; i++) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        temp.push("" + i);
                    }
                    this.setData({
                        ['multiArray[2]']: temp
                    });
                } else {
                    for (let i = 1; i <= 28; i++) {
                        if (i < 10) {
                            i = "0" + i;
                        }
                        temp.push("" + i);
                    }
                    this.setData({
                        ['multiArray[2]']: temp
                    });
                }
            }
        }
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        data.multiIndex[e.detail.column] = e.detail.value;
        this.setData(data);
    },

    /**
     * 根据id查询地址信息
     */
    getAddressById: function(id){
        let url = '/address/' + id;
        app.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                this.setData({
                    haveAddress: true,
                    addressInfo: res.data,
                    addressId: id
                })
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 留言输入框监听事件
     */
    bindKeyInput: function(e) {
        let value = e.detail.value;
        this.setData({
            remark: value
        });
    },


    /**
     * 订单支付
     */
    btnPay: function (){
        let url = '/appointment';
        let data = {
            time: this.data.time,
            remark: this.data.remark,
            userId: wx.getStorageSync("userId"),
            receiverAddressId: this.data.addressId
        };
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                app.optionToast(res.msg);
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
        this.setData({
            choose_year: this.data.multiArray[0][0],
        });
        if(!isEmpty(options.addressId)){
            this.getAddressById(options.addressId);
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
