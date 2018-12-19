/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function getTime(time) {
  if (time === undefined ||
    time === null ||
    time === 'undefined' ||
    time === 'null' ||
    time === 0) {
    return null
  } else {
    let date = new Date(time)
    return date.getTime()
  }
}

// 函数节流
export function debounce(func, delay) {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 数字转化为大写汉字
export function SimplifiedChinese(Num) {

  for (let i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', '') // 替换Num中的“,”
    Num = Num.replace(' ', '') // 替换Num中的空格
  }
  if (isNaN(Num)) { // 验证输入的字符是否为数字
    // alert("请检查小写金额是否正确");
    return
  }
  // 字符处理完毕后开始转换，采用前后两部分分别转换
  let part = String(Num).split('.')
  let newchar = ''
  // 小数点前进行转化
  for (let i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      // alert("位数过大，无法计算");
      return ''
    } // 若数量超过拾亿单位，提示
    let tmpnewchar = ''
    let perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break
      case '1':
        tmpnewchar = '一' + tmpnewchar
        break
      case '2':
        tmpnewchar = '二' + tmpnewchar
        break
      case '3':
        tmpnewchar = '三' + tmpnewchar
        break
      case '4':
        tmpnewchar = '四' + tmpnewchar
        break
      case '5':
        tmpnewchar = '五' + tmpnewchar
        break
      case '6':
        tmpnewchar = '六' + tmpnewchar
        break
      case '7':
        tmpnewchar = '七' + tmpnewchar
        break
      case '8':
        tmpnewchar = '八' + tmpnewchar
        break
      case '9':
        tmpnewchar = '九' + tmpnewchar
        break
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + ''
        break
      case 1:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '十'
        break
      case 2:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '百'
        break
      case 3:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '千'
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '十'
        break
      case 6:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '百'
        break
      case 7:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '千'
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        tmpnewchar = tmpnewchar + '十'
        break
    }
    newchar = tmpnewchar + newchar
  }
  // 替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search('零零') !== -1 || newchar.search('零亿') !== -1 || newchar.search('亿万') !== -1 || newchar.search('零万') !== -1) {
    newchar = newchar.replace('零亿', '亿')
    newchar = newchar.replace('亿万', '亿')
    newchar = newchar.replace('零万', '万')
    newchar = newchar.replace('零零', '零')
  }
  // 替换以“一十”开头的，为“十”
  if (newchar.indexOf('一十') === 0) {
    newchar = newchar.substr(1)
  }
  // 替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') === newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1)
  }
  return newchar
}

// 判断对象是否为空
export function isEmptyObj(obj) {
  for (var key in obj) {
    return false
  }
  return true
}

// 判断是否为数组
export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

//  匹配网址
export function IsURL(urlString) {
  let regExp = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/
  if (urlString.match(regExp)) {
    return true
  } else {
    return false
  }
}

// 判断浏览器
function myBrowser() {
  var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf('Opera') > -1
  if (isOpera) {
    return 'Opera'
  } // 判断是否Opera浏览器
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF'
  } // 判断是否Firefox浏览器
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome'
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  } // 判断是否Safari浏览器
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    return 'IE'
  } // 判断是否IE浏览器
  if (userAgent.indexOf('Trident') > -1) {
    return 'Edge'
  } // 判断是否Edge浏览器
}

// 下载
export function oDownLoad(url, id) {
  if (myBrowser() === 'IE' || myBrowser() === 'Edge') {
    var oPop = window.open(url, '', 'width=1, height=1, top=5000, left=5000')
    for (; oPop.document.readyState !== 'complete';) {
      if (oPop.document.readyState === 'complete') break
    }
    oPop.document.execCommand('SaveAs')
    oPop.close()
  } else {
    // !IE
    var odownLoad = document.getElementById(id)
    odownLoad.href = url
    odownLoad.download = ''
  }
}

export function downloadFile(url) {
  try {
    let elemF = document.createElement('iframe')
    elemF.src = url
    elemF.style.display = 'none'
    document.body.appendChild(elemF)
  } catch (e) {
    console.log('下载异常')
  }
}

export function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}


// 权限按钮
export function LogDiogFun(errorInfo) {
  if (errorInfo) {
    if (errorInfo.status === 403) {
    }
    if (errorInfo.status === 401) { // 如果未登陆，跳转到登陆页面
      //判断登录超时显示登录框的代码开始----------------
      let str = errorInfo.request ? errorInfo.request.responseURL : undefined
      if (str) {
        if (str.endsWith('/menus')) {
          let url = window.location.href
          window.location.href = '/login?backUrl=' + url
          return errorInfo
        }
        // else if(str.endsWith('/updateLevel')){
        // return errorInfo
        // }
      }
      let win = window
      let needAdd = true
      let con401 = win.document.getElementById("con401")
      if (!con401) {
        try {
          con401 = win.parent.document.getElementById("con401")
          if (con401) {
            win = win.parent
            needAdd = false
          }
        } catch (e) {
          needAdd = false
        }
      } else {
        needAdd = false
      }
      win.document.domain = "shinyway.org";
      if (needAdd && con401 === null) {
        let div = win.document.createElement("div")
        div.setAttribute("id", "con401")
        win.document.domain = "shinyway.org";
        div.innerHTML = "<span id='con401close'>关闭</span><iframe id='ifra401' src='/login' frameborder='0'></iframe>"
        win.document.body.appendChild(div)
        win.document.getElementById("con401close").onclick = function () {
          win.document.getElementById("con401").style.display = "none"
        }
      } else if (con401 !== null && con401.style.display === "none") {
        win.document.getElementById("ifra401").src = '/login'
        con401.style.display = "block"
      }
    }
  }
}