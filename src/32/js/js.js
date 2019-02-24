/**
 * Created by YY on 2018/5/5.
 */
var oBox = document.getElementById('box');
var obanner = document.getElementsByClassName("banner");
var oSpan = document.getElementsByClassName("tab")[0].getElementsByTagName("span");

var num = 0;
var timer = '';
obanner[0].style.opacity = "1";
oSpan[0].className = "on";

for(var i = 0;i<oSpan.length;i++){
    oSpan[i].index = i;
    oSpan[i].onclick = function(){
        num = this.index;
        for(var j = 0;j<obanner.length;j++){
            obanner[j].style.opacity = '0';
            oSpan[j].className = '';
        }
        obanner[num].style.opacity = '1';
        oSpan[num].className = 'on';
    }
}

timer = setInterval(function() {   //定时器，实现自动轮播
    num++;
    num %= obanner.length;
    for (var j = 0; j < obanner.length; j++) {
        obanner[j].style.opacity = '0';
        oSpan[j].className = '';
    }
    obanner[num].style.opacity = '1';
    oSpan[num].className = 'on';
},2000);

oBox.onmouseenter = function(){  //清楚定时器
    clearInterval(timer);
};
oBox.onmouseleave = function(){
    timer = setInterval(function() {   //定时器，实现自动轮播
        num++;
        num %= obanner.length;
        for (var j = 0; j < obanner.length; j++) {
            obanner[j].style.opacity = '0';
            oSpan[j].className = '';
        }
        obanner[num].style.opacity = '1';
        oSpan[num].className = 'on';
    },2000);
}