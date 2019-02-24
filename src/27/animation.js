/*
    参数： * 必填   []选填

        *obj        需要运动的对象（原生DOM节点）
        *json       变化的属性（必须是json对象，）  低版本IE要在css给初始值，不然时是auto
        *time       动画持续时间

        [easing]    运动函数（默认匀速运动）
                    1.Linear 匀速，  此时speed可以不填。
                    2.Quad 二次方缓动效果
                    3.Cubic 三次方缓动效果
                    4.Quart 四次方缓动效果
                    5.Quint 五次方缓动效果

                    6.Sine  正弦缓动效果
                    7.Expo  指数缓动效果
                    8.Circ  圆形缓动函数

                    9.Elastic 指数衰减正弦曲线缓动函数
                    10.Back  超过范围的三次方的缓动函数
                    11.Bounce 指数衰减的反弹曲线缓动函数
        
        [speed]     运动方式（值为Number）
                    0   代表加速运动
                    1   代表减速运动
                    2   先加速后减速

        [callback]  回调函数，this指向obj。
*/
/*
	* t: current time（当前时间）；
	* b: beginning value（初始值）；
	* c: change in value（变化量）；
	* d: duration（持续时间）。	

*/

function animation(ele, data, time, cb) {
  // requestAnimationFrame 的兼容
  window.requestAnimationFrame = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 1000 / 60) }
  // 获取对象的样式
  function getStyle(ele) {return ele.currentStyle || getComputedStyle(ele)}
  // tween.js 运动库
  var Tween = {
    Linear: {
      easeIn: function (t, b, c, d) {
        return c * t / d + b;
      }
    },
    Quad: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t + b;
      },
      easeOut: function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    Cubic: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    Quart: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    Quint: {
      easeIn: function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOut: function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    Sine: {
      easeIn: function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOut: function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      }
    },
    Expo: {
      easeIn: function (t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOut: function (t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
      },
      easeInOut: function (t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    Circ: {
      easeIn: function (t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOut: function (t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOut: function (t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    Elastic: {
      easeIn: function (t, b, c, d, a, p) {
        var s;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
          s = p / 4;
          a = c;
        } else {
          s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      },
      easeOut: function (t, b, c, d, a, p) {
        var s;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (typeof p == "undefined") p = d * .3;
        if (!a || a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else {
          s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
      },
      easeInOut: function (t, b, c, d, a, p) {
        var s;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (typeof p == "undefined") p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else {
          s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    },
    Back: {
      easeIn: function (t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOut: function (t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOut: function (t, b, c, d, s) {
        if (typeof s == "undefined") s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
      }
    },
    Bounce: {
      easeIn: function (t, b, c, d) {
        return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
      },
      easeOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
          return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
          return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
          return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
          return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
      },
      easeInOut: function (t, b, c, d) {
        if (t < d / 2) {
          return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
        } else {
          return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
      }
    }
  }

  // 运动函数的选择配置项
  var option = data.options // options 存起来 
  // 对象要改变的属性
  var valueDate = data.data  

  // speed的数组【easeIn。。】
  var speedArr = ["easeIn", "easeOut", "easeInOut"]

  // 存放起始值
  var startValue = {} 
  // 终点 - 起始 = 变化量
  var changeValue = {}
  // 起始时间  
  var startTime = new Date()  // 起始时间
  
  var eleStart = getStyle(ele) // 取到ele对象的所有样式

  for (var key in valueDate) {
    var val = parseFloat(eleStart[key])
    startValue[key] = isNaN(val) ? 0 : val
    changeValue[key] = parseFloat(valueDate[key]) - startValue[key] // 目标值 - 起始值  =  变化量
  }

  // options 的默认情况
  var speed = option && option.speed
  var easing = option && option.easing

  if (typeof option === "object") {
    if("easing" in option){ // options 存在运动函数
      speed = speed || 0
      // 确定easing 是不是Linear
      
      if(easing.toLowerCase() === 'linear'){
        speed = 0
        easing = "Linear"
      }
    }else{
      speed = 0
      easing = "Linear"
    }
  }else{ // 没有options 参数 默认 匀速运动
    speed = 0
    easing = "Linear"
  }
  run()
  function run() { // 计算每个调用时刻的  属性值
    var t = new Date() - startTime
    var t_ = time - t
    for (var key in changeValue) {
      var val = Tween[easing][speedArr[speed]](t, startValue[key], changeValue[key], time)
      
      var currentValue = parseFloat(valueDate[key])
      // 限制最大值
      if(t_ <= 0){
        val = Math.min(val, currentValue)
        val = Math.max(val, currentValue)
      }

      if(key.toLowerCase() === "opacity"){
        ele.style[key] = val
        ele.style.filter = "alpha(opacity=" + val * 100 + ")" // IE透明度
      }else{
        ele.style[key] = val + "px"
      }
    }
    if(t_ <= 0){
      cb && cb()
    }else{
      requestAnimationFrame(run)
    }
  }
}