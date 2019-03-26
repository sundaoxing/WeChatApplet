// 引用js脚本文件
var postData = require('../../../data/post-detail-data.js')
// 获取全局参数
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postDetail:{},//post详情
    postId:-1,//postId
    collected:false,//是否收藏
    isPlaying:false,//是否正在播放音乐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*
    option.参数名
        获取wx.navigateTo跳转页面附带了参数
    */
    var postId = options.id;
    // 根据id，获取对应的post详情对象
    var postDetail = postData.postList[postId];
    // this.data.postDetail=postDetail无效
    // 使用setData({})设置data对象的属性值
    this.setData({
      postDetail: postDetail,
      postId: postId,
    });

    //如果页面正在播放音乐，并且音乐属于当前页面，则显示播放图标
    if (app.globalData.g_isPlaying && app.globalData.g_musicPostId === postId) {
      this.setData({
        isPlaying: true
      });
    }
    this.onInitCollection(postId);
    this.onMusicMonitor();
  },

  /*
   使用本地缓存，实现收藏和取消收藏（初始化操作）
     1.从本地缓存中取出[postId：collected]的数组列表[0:true,1:false]
     2.判断数组列表是否不为空：
         是：1.根据postId获取当前collected值
             2.判断当前collected值是否undefined（因为数组列表不为空时，其对应的postId没有赋值，可能为undefined）
                 是：默认data对象的collected属性值为false
                 否：设置data对象的collected属性值为当前collected值
         否：1.新建[postId：collected]的数组列表
             2.默认postId对应的collected为false
             3.将[postId：collected]的数组列表放入本地存储
   */
  onInitCollection: function(postId) {
    var collectedList = wx.getStorageSync('postCollectedList');
    if (collectedList) {
      var currentCollected = collectedList[postId];
      if (typeof(currentCollected) == "undefined") {
        this.setData({
          collected: false
        });
      } else {
        this.setData({
          collected: currentCollected
        });
      }
    } else {
      var collectedList = {};
      collectedList[postId] = false;
      wx.setStorageSync('postCollectedList', collectedList);
    }
  },

  /*
  音乐播放监听器：系统调用
    1.保存本页面this对象：监听器是回调函数，需要暂存this对象，不然无法使用this
    2.调用监听音乐播放：更新本地播放状态isplaying和全局播放状态g_isPlaying以及音乐播放是不是属于当前页面
    3.调用监听音乐播放暂停：更新本地播放状态isplaying和全局播放状态g_isPlaying以及音乐播放是不是属于当前页面
  */
  onMusicMonitor: function() {
    var that = this;
    //播放
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlaying: true
      });
      app.globalData.g_isPlaying = true;
      app.globalData.g_musicPostId = that.data.postId;
    });
    //暂停
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlaying: false
      });
      app.globalData.g_isPlaying = false;
      app.globalData.g_musicPostId = null;
    });
    //停止
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlaying: false
      });
      app.globalData.g_isPlaying = false;
      app.globalData.g_musicPostId = null;
    });
  },

  /*
    使用本地缓存，实现收藏和取消收藏（点击操作）
      1.从本地缓存中取出[postId：collected]的数组列表
      2.根据postId获取当前collected值
      3.取当前collected值的相反值（true取false,false取true）
      4.更新[postId：collected]的数组列表对应的collected值
      5.更新本地缓存[postId：collected]的数组列表
      6.设置data对象的collected属性值为当前collected值
    */
  onCollectTap: function(event) {
    var collectedList = wx.getStorageSync('postCollectedList');
    var currentCollected = collectedList[this.data.postId];
    currentCollected = !currentCollected;
    collectedList[this.data.postId] = currentCollected;
    wx.setStorageSync('postCollectedList', collectedList);
    this.setData({
      collected: currentCollected
    });
    //显示提示交互信息
    wx.showToast({
      title: currentCollected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success'
    })
  },

  /*
  音乐播放暂停响应事件：用户调用
    1.根据当前postId获取postList列表中的music对象
    2.判断本地音乐播放是否在播放
        是：暂停音乐，更新本地播放状态isplaying
        否：播放音乐，更新本地播放状态isplaying
  */
  onPlayTap: function(event) {
    var music = postData.postList[this.data.postId].music;
    if (this.data.isPlaying) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlaying: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      });
      this.setData({
        isPlaying: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})