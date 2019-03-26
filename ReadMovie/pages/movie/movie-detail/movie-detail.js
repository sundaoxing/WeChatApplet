// 获取app全局接口
var app = getApp();
// 获取util.js文件接口
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{}//js电影对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取跳转方法附带的电影Id
    var movieId = options.id;
    // 构建电影详情请求url
    var detailUrl = app.globalData.baseDouban+'/v2/movie/subject/'+movieId;
    this.getMovies(detailUrl);
  },

  /*
  获取电影，根据请求url
  */
  getMovies: function (url) {
    var that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'json'
      },
      method: 'GET',
      success: function (res) {
        that.prossesMovie(res.data);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /*
   预处理电影数据：截取部分信息
      1.判断服务器响应的电影数据是否为空，是，直接返回
      2.调用getDirector(data)方法，获取Director对象
      3.调用getMovie(data,director)方法，获取电影movie对象
      4.更新data域中movie的值
  */
  prossesMovie: function (data) {
    if(!data){
      return;
    }
    var director =this.getDirector(data);
    var movie = this.getMovie(data,director);
    this.setData({
      movie:movie
    })
  },

  /*
  获取Director对象
  */
  getDirector :function(data){
    var director = {
      avatar: '',
      name: '',
      id: ''
    };

    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    return director;
  },

  /*
  获取电影movie对象
  */
  getMovie:function(data,director){
    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('，'),
      stars: util.convertStarToArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertCastToString(data.casts),
      castsInfo: util.convertCastToInfos(data.casts),
      summary: data.summary
    };
    return movie;
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