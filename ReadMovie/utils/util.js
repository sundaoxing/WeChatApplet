const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
电影评分转换成数组（重新编码）：4分：[1,1,1,1,0]，满分5分
  1.将电影评分保存正数部分，截取
  2.循环遍历5次
      判断当前循环次数i是否小于电影评分
          是：向数组中添加1
          否：向数组中添加0
  3.返回评分数组
*/
function convertStarToArray(star){
  var num = star.toString().substring(0,1);
  var array = [];
  for(var i=1 ;i<=5;i++){
    if(i<=num){
      array.push(1);
    }else{
      array.push(0);
    }
  }
  return array;
}

/*
演员名称重新排版：使用‘/’分隔姓名
  1.创建演员名称对象
  2.遍历演员信息数组
      在每个演员名称后加上‘/’
  3.返回拼接后演员名称对象
*/
function convertCastToString(casts){
  var castsjoin='';
  for(var idx in casts){
    castsjoin = castsjoin+casts[idx].name+'/';
  }
  return castsjoin.substring(0,castsjoin.length-2);
}

/*
演员海报重新排版
  1.创建演员海报数组
  2.遍历演员信息数组
      1.创建演员海报对象，并设置其属性值
      2.将演员海报对象添加近演员海报数组中
  3.返回演员海报数组
*/
function convertCastToInfos(casts) {
  var castsArray = [];
  for (var idx in casts) {
    var cast = {
      img:casts[idx].avatars ? casts[idx].avatars.large :'',
      name:casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

//导出：提供外界调用接口
module.exports = {
  formatTime: formatTime,
  convertStarToArray: convertStarToArray,
  convertCastToString: convertCastToString,
  convertCastToInfos: convertCastToInfos
}
