// pages/post/post.js
// 引用js脚本文件
var postData = require('../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据:初始化
   */
  data: {
    post_key:[]//post数组
  },
  /*
  target与currentTarget的区别：
    target：获取当前点击的组件的属性值
    currentTarget：获取捕获组件的属性值
  */
  /*
  跳转：跳转到post-detail页面，附带当前post的Id
  */
  onPostTap:function(event){
    //获取当前绑定的view中自定义属性postid的值
    var postId=event.currentTarget.dataset.postid;
    // 跳转页面附带参数使用"？"跟参数名+参数值
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  },
  /*
  跳转：跳转到post-detail页面，附带当前post的Id
  */
  onSwiperTap:function(event){
    //获取当前绑定的image中自定义属性postid的值
    var postId = event.target.dataset.postid;
    // 跳转页面附带参数使用"？"跟参数名+参数值
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  /*数据绑定
    执行顺序：先执行onLoad方法，在读取data对象的属性
    1.数据绑定：var定义js对象，然后调用this.setData(js对象)方法，将对象传给wxml中{{对应属性名称}}

    2.数据绑定：对象
    this.setData(post_content);

    3.数据绑定：key:value键值对
    this.setData({
      post_key:post_content
      });

    4.直接给data对象的属性赋值：无效(因为没有在data{}中初始化)
    this.data.postList=postData.postList
  */
    this.setData({
      post_key:postData.postList
    });
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