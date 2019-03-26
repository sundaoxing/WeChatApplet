// 获取app全局接口
var app = getApp();
// 获取util.js接口
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestUrl: '',//电影分类请求url
    totalCount: 0,//分页请求：请求结果个数叠加
    isEmpty: true//是否是第一次加载（下拉加载会使电影列表累加，不下拉，就直接显示20条数据）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取转发方法附带的参数category
    var category = options.category;
    // 根据category电影分类构建请求url
    var url = this.getUrl(category);
    this.setData({
      category:category,
      requestUrl: url
    });
    this.getMovies(url);
  },

  /*
  获取请求url：根据category电影分类
  */
  getUrl: function (category){
    var url = app.globalData.baseDouban;
    switch (category) {
      case "正在热映":
        url = url + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        url = url + '/v2/movie/coming_soon';
        break;
      case "热门排榜":
        url = url + '/v2/movie/top250';
        break;
    }
    return url;
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
  下拉加载：响应事件
  */
  onScrollLower: function (event) {
    // 分页请求数据url，每次起始请求都累加20条，每次请求20条数据
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    this.getMovies(nextUrl);
    wx.showLoading({
      title: '加载中',
    })
  },

  /*
  预处理电影数据：截取部分信息
    1.创建电影列表数组
    2.遍历服务器响应的数据中的subjects（电影）数组
        1.获取服务器响应的js电影对象
        2.调用getMovie（subject)方法，获取js电影对象temp
        3.将temp存入movies电影数组中
    3.创建累加电影列表数组（因为下拉加载也会调用这个方法，并且电影列表是累加的）
    4.判断是否是第一次加载：
        是：将电影数组赋值给累加电影列表数组，并将isEmpty设置为false
        否：将电影数组累加并赋值给累加电影列表数组
    5.更新data域中movies的值，totalCount（请求结果个数）累加20条，作为下次请求个数起点
    6.调用noMore(movies)方法，判断是否还有数据
  */
  prossesMovie: function (data) {
    var movies = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var temp = {
        title: subject.title,
        average: subject.rating.average,
        coverImgUrl: subject.images.large,
        star: util.convertStarToArray(subject.rating.stars),
        movieId: subject.id
      };
      movies.push(temp);
    }
    var totalMovies = {};
    if (this.data.isEmpty) {
      totalMovies = movies;
      this.data.isEmpty = false;
    } else {
      totalMovies = this.data.movies.concat(movies);
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    //与wx.showLoading（）同步出现
    wx.hideLoading();
    this.noMore(movies);
  },

  /*
  判断下拉加载是否还有数据
  */
  noMore: function (movies) {
    if (movies.length == 0) {
      wx.showToast({
        title: '没有更多啦',
        duration: 1000,
        icon: 'none'
      })
    }
  },

  /*
  页面跳转：跳转到movie-detail页面，附带movieId
  */
  onMovieDetailTap: function (event) {
    //获取捕获组件的属性值movieid
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //动态设置导航栏文字显示
    wx.setNavigationBarTitle({
      title: this.data.category,
    })
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
    // var nextUrl = this.data.requestUrl + '?start=0&count=20';
    // this.data.movies = {};
    // this.data.isEmpty = true;
    // this.getMovies(nextUrl);
    // wx.showToast({
    //   title: '已刷新',
    //   duration: 1000,
    //   icon: 'none'
    // })
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