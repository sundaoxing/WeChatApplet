// 引入app全局接口
var app = getApp();
// 引入util.js接口
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},//正在热映：js对象：{categoryName：value，movies：[]}
    comingSoon: {},//即将上映：js对象：{categoryName：value，movies：[]}
    top250: {},    //热门榜单：js对象：{categoryName：value，movies：[]}
    searchResult: {},//搜索结果：js对象：{：value，movies：[]}
    containerShow: true,//电影主页是否显示
    searchPanelShow: false,//搜索页面是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //定义每种电影分类请求url和请求结果个数
    var inTheatersUrl = app.globalData.baseDouban + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = app.globalData.baseDouban + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.baseDouban + '/v2/movie/top250' + '?start=0&count=3';
    this.getMovies(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovies(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovies(top250Url, 'top250', '热门排榜');
  },

  /*
  获取电影，根据请求url
    1.保存本页面this对象：request请求方法是异步函数，需要暂存this对象，不然无法使用this
  */
  getMovies: function(url, category, categoryName) {
    var that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'json'
      },
      method: 'GET',
      // 请求成功：res：服务器响应的数据
      success: function(res) {
        that.prossesMovie(res.data, category, categoryName);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /*
  预处理电影数据：截取部分信息
    1.创建电影列表数组
    2.遍历服务器响应的数据中的subjects（电影）数组
        1.获取服务器响应的js电影对象
        2.调用getMovie（subject)方法，获取js电影对象temp
        3.将temp存入movies电影数组中
    3.将电影按照分类名称映射到data数据域中
  */
  prossesMovie: function(data, category, categoryName) {
    var movies = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var temp = this.getMovie(subject);
      movies.push(temp);
    }
    /*
    js动态绑定数据：按照电影分类名称映射到data数据域
    */
    var readyData = {};
    readyData[category] = {
      name: categoryName,
      movies: movies
    };
    this.setData(readyData);
  },

  /*
  获取电影：根据服务器响应的电影对象
  */
  getMovie:function(subject){
    var temp = {
      title: subject.title,
      average: subject.rating.average,
      coverImgUrl: subject.images.large,
      star: util.convertStarToArray(subject.rating.stars),
      movieId: subject.id
    };
    return temp;
  },

  /*
  页面跳转：跳转到movie-more页面，附带当前电影的分类
  */
  onMoreTap: function(event) {
    //获取捕获组件的category属性值
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'movie-more/movie-more?category=' + category
    })
  },

  /*
  input组件：光标获取焦点响应事件
      控制电影主页和搜索页面的显示
  */
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,//电影主页隐藏
      searchPanelShow: true,//搜索页面显示
    })
  },

  /* 
  搜索框中XX：点击响应事件
    控制电影主页和搜索页面的显示
  */
  onCancelTap: function(event) {
    this.setData({
      containerShow: true,//电影主页显示
      searchPanelShow: false,//搜索页面隐藏
    })
  },

  /*
  input组件：光标失去焦点响应事件：提交搜索关键字，请求搜索结果
    1.获取input输入框的输入内容，使用event.detail.value
    2.创建搜索请求url
    3.调用getMovies(searchUrl, 'searchResult', '查询结果')方法，获取搜索结果
  */
  onBindBlur: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.baseDouban + '/v2/movie/search?q=' + text;
    this.getMovies(searchUrl, 'searchResult', '查询结果');
  },

  /*
  页面跳转：跳转到movie-detail页面，附带movieId参数
  */
  onMovieDetailTap:function(event){
    //获取捕获组件的movieid属性值
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
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
  onPullDownRefresh: function() {},

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