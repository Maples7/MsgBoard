/**
 * Created by Maples7 on 2016/3/21.
 */

module.exports = function getTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var date_today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  return year + '-' + (month + 1) + '-'
    + date_today + ' ' + hours + ':'
    + (minutes < 10 ? '0' + minutes : minutes) + ':'
    + (seconds < 10 ? '0' + seconds : seconds);
};
