// 乘法
function multiplication(value1, value2) {
    let number = 0,
        v1 = value1.toString(),
        v2 = value2.toString();
    try {
        number += v1.split(".")[1].length;
    } catch (t) {
    }
    try {
        number += v2.split(".")[1].length;
    } catch (t) {
    }
    return Number(v1.replace(".", "")) * Number(v2.replace(".", "")) / Math.pow(10, number);
}

function a(t, a) {
    let e, s, i;
    try {
        e = t.toString().split(".")[1].length;
    } catch (t) {
        e = 0;
    }
    try {
        s = a.toString().split(".")[1].length;
    } catch (t) {
        s = 0;
    }
    return i = Math.pow(10, Math.max(e, s)), (t * i + a * i) / i;
}



const app = getApp();
const util = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.HOST + '/',
        hidden: false,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        shoppingCarList: [],
        scrollHeight: 0,
        totalPrice: 0,
        totalNumber: 0,

        hiddenLoginModal: true,
        modalLoginTitle: "您尚未登录，请前往'我的'界面完成登录",

        hiddenModal: true,
        modalTitle: '',
        modalConfirmText: '',
        modalCancelText: '',
        modalAct: '',
        modalOrderId: null,


        hascarts: false,

        carts: [],
        actname: {},
        sIcon: {},
        pIcon: {},
        num: {},
        price: {},
        pnum: 0,
        total: 0,
        iconAllChosed: !1,
        noRefresh: !0
    },

    modalConfirm: function(t) {
        let act = t.target.dataset.act,
            id = t.target.dataset.id;

        switch (act) {
            case "confirmOrder":
                this.confirmReceive(id);
                break;
            case "deleteShoppingProduct":
                this.deleteShoppingProduct(id);
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
     * 删除购物车商品
     */
    deleteShoppingProduct: function(id){
        let url = '/shopping_car/product/' + id;
        app.wxRequest('DELETE', url, null, (res) => {
            if (res.result) {
                this.getShoppingCarList()
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 获取购物车列表
     */
    getShoppingCarList: function () {
        let url = '/shopping_car';
        let data = {
            userId: wx.getStorageSync("userId"),
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let shoppingCarList = res.data.content;
                for (let i in shoppingCarList) {
                    shoppingCarList[i].selected = false;
                    for (let j in shoppingCarList[i].shoppingProducts) {
                        shoppingCarList[i].shoppingProducts[j].selected = false;
                    }
                }
                this.setData({
                    hidden: true,
                    shoppingCarList: shoppingCarList,
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

    changeProductNumber: function(type, shoppingProductId){
        let url = '/shopping_car/product';
        let data = {
            type: type,
            shoppingProductId: shoppingProductId
        };
        app.wxRequest('PUT', url, data, (res) => {
            if (res.result) {
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    payment: function(){
        let url = "../cart/order/index?origin=1",
            shoppingCarList = this.data.shoppingCarList;

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
        let totalPrice = 0,
            totalNumber = 0;
        for(let i in shoppingCarList){
            let shoppingProducts = shoppingCarList[i].shoppingProducts;
            for(let j in shoppingProducts){
                if(shoppingProducts[j].selected){
                    data.shoppingProductIdList.push(shoppingProducts[j].id);
                    switch (shoppingProducts[j].productType) {
                        case 0:
                            let info = {
                                productId: shoppingProducts[j].product.id,
                                productInfo: shoppingProducts[j].product,
                                classifyType: 0,
                                number: shoppingProducts[j].productNumber,
                                totalPrice: multiplication(shoppingProducts[j].product.price, shoppingProducts[j].productNumber)
                            };
                            data.sell.push(info);
                            break;
                        case 1:
                            let product = shoppingProducts[j].product;
                            product.number = shoppingProducts[j].productNumber;
                            let productList = {
                                productId: product.id,
                                productNumber: product.number
                            };
                            data.lease.productList.push(productList);
                            data.lease.productInfo.push(product);
                            data.lease.classifyType = 1;

                            totalPrice += multiplication(shoppingProducts[j].product.leasePrice, shoppingProducts[j].productNumber);
                            totalNumber += shoppingProducts[j].productNumber;

                            data.lease.totalPrice = totalPrice;
                            data.lease.number = totalNumber;
                            break;
                    }
                }
            }
        }

        wx.setStorageSync("orderPayList", data);
        wx.navigateTo({
            url: url
        });

    },

    /**
     * 全选某一商品类型
     */
    chooseProductList: function (e) {
        let shoppingCarId = e.currentTarget.dataset.shoppingCarId,
            type = e.currentTarget.dataset.type,
            shoppingCarIndex = e.currentTarget.dataset.shoppingCarIndex;
        let totalPrice = this.data.totalPrice,
            totalNumber = this.data.totalNumber,
            shoppingCarList = this.data.shoppingCarList;
        if(shoppingCarList[shoppingCarIndex].selected){
            for(let i in shoppingCarList[shoppingCarIndex].shoppingProducts){
                shoppingCarList[shoppingCarIndex].selected = false;
                shoppingCarList[shoppingCarIndex].shoppingProducts[i].selected = false;
                switch (type) {
                    case 0:
                        totalPrice -= multiplication(shoppingCarList[shoppingCarIndex].shoppingProducts[i].product.price, shoppingCarList[shoppingCarIndex].shoppingProducts[i].productNumber);
                        break;
                    case 1:
                        totalPrice -= multiplication(shoppingCarList[shoppingCarIndex].shoppingProducts[i].product.leasePrice, shoppingCarList[shoppingCarIndex].shoppingProducts[i].productNumber);
                        break;
                }
                totalNumber -= 1;
            }
        }else {
            for(let i in shoppingCarList[shoppingCarIndex].shoppingProducts){
                shoppingCarList[shoppingCarIndex].selected = true;
                if(shoppingCarList[shoppingCarIndex].shoppingProducts[i].selected == false){
                    shoppingCarList[shoppingCarIndex].shoppingProducts[i].selected = true;
                    switch (type) {
                        case 0:
                            totalPrice += multiplication(shoppingCarList[shoppingCarIndex].shoppingProducts[i].product.price, shoppingCarList[shoppingCarIndex].shoppingProducts[i].productNumber);
                            break;
                        case 1:
                            totalPrice += multiplication(shoppingCarList[shoppingCarIndex].shoppingProducts[i].product.leasePrice, shoppingCarList[shoppingCarIndex].shoppingProducts[i].productNumber);
                            break;
                    }
                    totalNumber += 1;
                }

            }
        }

        this.setData({
            totalPrice: totalPrice,
            totalNumber: totalNumber,
            shoppingCarList: shoppingCarList
        })

    },

    /**
     * 单选某一商品
     */
    chooseProduct: function (e) {
        let carId = e.currentTarget.dataset.carId,
            productId = e.currentTarget.dataset.productId,
            carIndex = e.currentTarget.dataset.carIndex,
            productIndex = e.currentTarget.dataset.productIndex,
            productType = e.currentTarget.dataset.productType,
            productSell = e.currentTarget.dataset.productSell,
            productLease = e.currentTarget.dataset.productLease,
            productNumber = e.currentTarget.dataset.productNumber;
        let totalPrice = this.data.totalPrice,
            totalNumber = this.data.totalNumber,
            shoppingCarList = this.data.shoppingCarList;
        if (shoppingCarList[carIndex].shoppingProducts[productIndex].selected) {
            switch (productType) {
                case 0:
                    totalPrice -= multiplication(productSell, productNumber);
                    break;
                case 1:
                    totalPrice -= multiplication(productLease, productNumber);
                    break;
            }
            totalNumber--;
            shoppingCarList[carIndex].shoppingProducts[productIndex].selected = false;
        } else {
            switch (productType) {
                case 0:
                    totalPrice += multiplication(productSell, productNumber);
                    break;
                case 1:
                    totalPrice += multiplication(productLease, productNumber);
                    break;
            }
            totalNumber++;
            shoppingCarList[carIndex].shoppingProducts[productIndex].selected = true;
        }

        this.setData({
            totalPrice: totalPrice,
            totalNumber: totalNumber,
            shoppingCarList: shoppingCarList
        });

        // 判断全部商品是否全部选中
        this.productsIsAllChoose(carIndex);
    },

    /**
     * 按钮减操作
     */
    bindMinus: function(e){
        let carId = e.currentTarget.dataset.carId,
            productId = e.currentTarget.dataset.productId,
            carIndex = e.currentTarget.dataset.carIndex,
            productIndex = e.currentTarget.dataset.productIndex,
            productType = e.currentTarget.dataset.productType,
            productSell = e.currentTarget.dataset.productSell,
            productLease = e.currentTarget.dataset.productLease;

        let totalPrice = this.data.totalPrice,
            shoppingCarList = this.data.shoppingCarList;
        if (shoppingCarList[carIndex].shoppingProducts[productIndex].selected) {
            let productNumber = shoppingCarList[carIndex].shoppingProducts[productIndex].productNumber;
            if(--productNumber <= 0){
                this.setData({
                    hiddenModal: false,
                    modalTitle: "您是否删除此条记录",
                    modalConfirmText: "是",
                    modalCancelText: "否",
                    modalAct: "deleteShoppingProduct",
                    modalShoppingProductId: productId
                });
            }else {
                switch (productType) {
                    case 0:
                        totalPrice -= productSell;
                        break;
                    case 1:
                        totalPrice -= productLease;
                        break;
                }
                --shoppingCarList[carIndex].shoppingProducts[productIndex].productNumber
                this.changeProductNumber(0, productId);
            }
        }else {
            let productNumber = shoppingCarList[carIndex].shoppingProducts[productIndex].productNumber;
            if(--productNumber <= 0){
                this.setData({
                    hiddenModal: false,
                    modalTitle: "您是否删除此条记录",
                    modalConfirmText: "是",
                    modalCancelText: "否",
                    modalAct: "deleteShoppingProduct",
                    modalShoppingProductId: productId
                });
            }else {
                --shoppingCarList[carIndex].shoppingProducts[productIndex].productNumber
                this.changeProductNumber(0, productId);
            }
        }
        this.setData({
            totalPrice: totalPrice,
            shoppingCarList: shoppingCarList
        });
    },

    /**
     * 按钮加操作
     */
    bindPlus: function(e){
        let carId = e.currentTarget.dataset.carId,
            productId = e.currentTarget.dataset.productId,
            carIndex = e.currentTarget.dataset.carIndex,
            productIndex = e.currentTarget.dataset.productIndex,
            productType = e.currentTarget.dataset.productType,
            productSell = e.currentTarget.dataset.productSell,
            productLease = e.currentTarget.dataset.productLease;

        let totalPrice = this.data.totalPrice,
            totalNumber = this.data.totalNumber,
            shoppingCarList = this.data.shoppingCarList;
        if (shoppingCarList[carIndex].shoppingProducts[productIndex].selected) {
            switch (productType) {
                case 0:
                    totalPrice += productSell;
                    break;
                case 1:
                    totalPrice += productLease;
                    break;
            }
            ++shoppingCarList[carIndex].shoppingProducts[productIndex].productNumber;
            this.changeProductNumber(1, productId);
        }else {
            ++shoppingCarList[carIndex].shoppingProducts[productIndex].productNumber;
            this.changeProductNumber(1, productId);
        }
        this.setData({
            totalPrice: totalPrice,
            totalNumber: totalNumber,
            shoppingCarList: shoppingCarList
        });
    },

    /**
     * 判断全部商品是否全部选中
     */
    productsIsAllChoose: function (carIndex) {
        let count = 0;
        let shoppingCarList = this.data.shoppingCarList;
        let shoppingProducts = shoppingCarList[carIndex].shoppingProducts;

        for (let i = 0; i < shoppingProducts.length; i++) {
            if (shoppingProducts[i].selected) {
                count++;
            }
        }
        if (count == shoppingProducts.length) {
            this.data.shoppingCarList[carIndex].selected = true;
        } else {
            this.data.shoppingCarList[carIndex].selected = false;
        }

        this.setData({
            shoppingCarList: shoppingCarList
        });
    },

    /**
     * 弹出框确定按钮（跳转至我的）
     */
    modalLoginConfirm: function(){
        wx.switchTab({
            url: '/pages/user/index'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        let openid = wx.getStorageSync("openid"),
            userId = wx.getStorageSync("userId");
        if(util.isEmpty(openid) || util.isEmpty(userId)){
            this.setData({
                hiddenLoginModal: false
            })
        }else {
            this.setData({
                hiddenLoginModal: true
            })
        }

        this.setData({
            totalPrice: 0,
            totalNumber: 0,
        });
        let that = this;
        wx.getSystemInfo({
            success: function (t) {
                that.setData({
                    scrollHeight: t.windowHeight
                });
            }
        });
        wx.removeTabBarBadge({
            index: 2
        });
        wx.setStorageSync("shoppingCar", 0);
        this.getShoppingCarList();
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
        let that = this;
        wx.getSystemInfo({
            success: function (t) {
                that.setData({
                    scrollHeight: t.windowHeight
                });
            }
        });
        this.getShoppingCarList();
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
