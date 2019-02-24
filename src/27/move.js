/**
 * 
 * @authors Xiao Feng
 * @date    2018-07-07 10:21:36
 * @version $Id$
 */
 function animation(obj,data={},time = 500,callback){
        var startValue={};  //定义初始值
        var changeValue={};  //定义变化值
        var startTime = new Date();
        var objstyle = getStyle(obj);//获取对象所有的样式
          // console.log(objstyle);
        for (var key in data) {
          var val = parseFloat(objstyle[key]); 

            startValue[key] = isNaN(val)?0:val;

            changeValue[key] = parseFloat(data[key]) - startValue[key] ;
        }
        //console.log(changeValue);
        //判断所用时间的函数
       run();
       function run(){
        var nowTime = new Date() - startTime;
        var t1 = nowTime/time;
        if(t1>=1){
         callback && callback();
        }else{
          requestAnimationFrame(run)
         }
         for (var  key in changeValue) {
           var val = t1 *changeValue[key] + startValue[key]; //改变的值加上初始值
           obj.style[key] = val +'px';
         }
       }
    }
// requestAnimationFrame 的兼容
 //window.requestAnimationFrame = window.requestAnimationFrame || function (callback) { return setTimeout(callback, 1000 / 60) }
     //获取样式的兼容
    function getStyle(obj){
       return obj.currentStyle || getComputedStyle(obj);
    }
