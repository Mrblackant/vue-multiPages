/**
 * Created by qkk on 15-3-29.
 */
//加载中效果
function loadding() {


    var mask2 = ' <div id="mask2" style="z-index:10001;background-color: white;opacity: 0.8;position:fixed;top:0;width:100%;height: 100%;"></div>';
    var loadingDiv = '<div id="loadding-div" style="z-index:10002;top:' + 200 + 'px;left:50%;position:fixed;">' +
        '<div class="book-loadding"></div>'+
        '</div>';
    $("body").prepend(mask2);
    $("body").prepend(loadingDiv);
}

function closeLoadding() {
    $("#mask2").remove();
    $("#loadding-div").remove();
}

// merge测试
//改版后模板和中文转换
function wtStyleToChinese(st){
//    if (st == "qingxin") {
//        return "清新";
//    } else if (st == "ziran") {
//        return "自然";
//    } else if (st == "yinweiai") {
//        return "因为爱";
//    } else if (st == "dabai") {
//        return "大白";
//    }else if(st=="zhimajie"){
//        return "芝麻街";
//    }else if(st=="simple"){
//        return "简洁";
//    }else if(st=="fruit"){
//        return "水果";
//    }else if(st=="xinyu"){
//        return "心语";
//    }
//    else {
//        return "标准风格";
//    }
    var styleChinese={
        "qingxin":"清新",
        "ziran":"自然",
        "yinweiai":"因为爱",
        "dabai":"大白",
        "zhimajie":"芝麻街",
        "simple":"简洁",
        "fruit":"水果",
        "xinyu":"心语",
        "rainbow":"彩虹",
        "chahua":"插画"
    };
    return styleChinese[st]||"标准风格";
}


//封面类型
// 1（铁塔）
// 2（熊猫）
// 3（喵喵）
// 4（街道）
// 4（咖啡）
function bookCoverToChinese(cn) {
//    if (cn == 1) {
//        return "白色铁塔";
//    } else if (cn == 2) {
//        return "白色小熊";
//    } else if (cn == 3) {
//        return "白色喵喵";
//    } else if (cn == 5) {
//        return "牛皮街道";
//    } else if (cn == 6) {
//        return "牛皮咖啡";
//    }else if (cn == 4) {
//        return "老牛皮纸封面";
//    }else if (cn == 100) {
//        return "自定义封面";
//    }else {
//        return "未知封面";
//    }
    var coverChinese={
        "1":"白色铁塔",
        "2":"白色小熊",
        "3":"白色喵喵",
        "4":"老牛皮纸封面",
        "5":"牛皮街道",
        "6":"牛皮咖啡",
        "7":"蓝色之恋",
        "8":"白色花朵",
        "9":"白色相机",
        "10":"黑色极简",
        "100":"自定义封面"
    };
    return coverChinese[cn]||"标准封面";
}

//支付方式
function payStateToChinese(payText) {
    if (payText == "Unpaid") {
        return "<span style='color:#ff5151'>未付款</span>";
    } else {
        return "<span style='color:#0fa830 '>已付款</span>";
    }
}

function payTypeToChinese(payText) {
    if (payText == "Alipay") {
        return "支付宝";
    } else if(payText == "Wxpay"){
        return "微信支付";
    }else {
        return "未知支付方式"
    }
}
//购买书排版
function booklayoutToChinese(layout){
    if(layout=="DoubleEdge"){
        return "双列";
    }else if(layout=="TimeAxis"){
        return "时光轴";
    }else if(layout=="WaterFall"){
        return "瀑布流";
    }else if(layout=="SameHeight"){
        return "瀑布流";
    }else if(layout=="WaterFallNew"){
        return "新瀑布流";
    }else if(layout=="QZoneJournal"){
        return "日志书";
    }else{
        return "标准排版";
    }
}

//毫秒转日期
function trangeDate(m) {
    var newTime = new Date(); //就得到普通的时间了
    newTime.setTime(m);
//    console.log(newTime.getFullYear()+"-"+newTime.getMonth()+"-"+newTime.getDate()+" "+newTime.getHours()+":"+newTime.getMinutes());
    var time = newTime.getFullYear() + "-" + (newTime.getMonth() + 1) + "-" + newTime.getDate() + " " + newTime.getHours() + ":" + newTime.getMinutes();
    return time;
}

//毫秒转日期
function turnDay(m) {
    var newTime = new Date(); //就得到普通的时间了
    newTime.setTime(m);
//    console.log(newTime.getFullYear()+"-"+newTime.getMonth()+"-"+newTime.getDate()+" "+newTime.getHours()+":"+newTime.getMinutes());
    var time = newTime.getFullYear() + "-" + addZeroBelowNine(newTime.getMonth() + 1) + "-" + addZeroBelowNine(newTime.getDate());
    return time;
}

//毫秒转日期
function turnMonthAndDay(m) {
    var newTime = new Date(); //就得到普通的时间了
    newTime.setTime(m);
//    console.log(newTime.getFullYear()+"-"+newTime.getMonth()+"-"+newTime.getDate()+" "+newTime.getHours()+":"+newTime.getMinutes());
    var time = addZeroBelowNine(newTime.getMonth() + 1) + "-" + addZeroBelowNine(newTime.getDate());
    return time;
}

//计算文字长度
//计算 中文，英文大写，英文小写的长度
//unicode
//a:97 z:122
//A:65  Z:90

function getTextLength(text){
    var zh=0;
    var enBig=0;
    var enSmall=0;
    var space=0;
    for(var i=0;i<text.length;i++){
        if(text.charCodeAt(i)>255){
            zh++;
        }else if(text.charCodeAt(i)<=90&&text.charCodeAt(i)>=65){
            enBig++;
        }else if(text.charCodeAt(i)<=122&&text.charCodeAt(i)>=97){
            enSmall++;
        }else if(text.charCodeAt(i)==32){
            space++;
        }
    }
    return {zh:zh,enBig:enBig,enSmall:enSmall,space:space};
}

//文本进行moji表情转换
function pIsNullToHtml(p,bookClassify) {
    return p == null ? "" : weixinMojiTranslate(p,bookClassify).replace(/\n/g,"<br/>");

}

function removeAndoridMojiText(text){
    if(text==null){
        return "";
    }else{
        var newText = text.replace(/\[emoji_.{4}\]/g, function(emoji) {
            return "";
        });
        // var removeUtfMoji= newText.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(emoji) {
        //     return "";
        // });
        return newText;
    }

}

function addZeroBelowNine(k){
    if(k<10){
        return '0'+k;
    }else{
        return k;
    }
}

function trimNullString(text){
    if(text==null){
        return "";
    }else{
        return text;
    }
}

//设置头像地址，null
function setHead(hdr){
    //头像
    var headurl= (hdr==null||hdr=="null")?"": hdr;
    if(headurl==""){
        $.ajax({
            type: "get",
            url: "/point?sfId="+userId,
            success: function (msg) {
                if(msg.user.headPicUrl!=""){
                    $(".bookshelf-head-pic-small").attr("src",msg.user.headPicUrl).addClass("animated bounceInDown");
                    $(".ljn-img-level").addClass("animated bounceInDown");
                    $(".bookshelf-head-pic-xs").attr("src",msg.user.headPicUrl).addClass("animated bounceInDown");
                }
                else{
                    $(".bookshelf-head-pic-small").addClass("animated zoomOutUp");
                    $(".ljn-img-level").addClass("animated zoomOutUp");
                    $(".bookshelf-head-pic-xs").addClass("animated zoomOutUp");
                }
            }
        });

    }else{
        $(".bookshelf-head-pic-small").attr("src",headurl).addClass("animated bounceInDown");
        $(".ljn-img-level").addClass("animated bounceInDown");
        $(".bookshelf-head-pic-xs").attr("src",headurl).addClass("animated bounceInDown");
    }
    $(".bookshelf-name").empty().append(weixinMojiTranslate(window.sessionStorage.getItem("nickName")));
}
//风格默认大白
function getBookStyle(bs){
    if(bs=="dabai"||bs=="qingxin"||bs=="zhimajie"||bs=="yinweiai"||bs=="ziran"||bs=="simple"||bs=="fruit"||bs=="xinyu"||bs=="chahua"||bs=="rainbow"){
        return bs;
    }else{
        //默认大白
        return "dabai";
    }
}

function backToBook(){

    $.ajax({
        url: "/product/"+bookId,
        type: "get",
        beforeSend: function () {
            // Handle the beforeSend event
            loadding();
        },
        complete: function () {
            // Handle the complete event
            closeLoadding();
        },
        dataType: "json",
        success: function (book) {

            var classify=book.classify;
            console.log(classify);
            var thisLayout=tools.getBookInfo(book.layouts).bookLayout;
            if(classify=="CALENDAR"){
                //日历
                window.location.href="cl-calender.html?bookId="+bookId+"&userId="+userId+"&p="+p;

            }else{
                if(thisLayout=="DoubleEdge"){
                    window.location.href="db-book.html?bookId="+bookId+"&userId="+userId+"&p="+p;

                }else  if(thisLayout=="TimeAxis"){
                    window.location.href="tl-book.html?bookId="+bookId+"&userId="+userId+"&p="+p;

                }else  if(thisLayout=="QZoneJournal"){
                    window.location.href="jn-book.html?bookId="+bookId+"&userId="+userId+"&p="+p;

                }else  if(thisLayout=="WaterFallNew"){
                    window.location.href="waterfallnew-book.html?bookId="+bookId+"&userId="+userId+"&p="+p;

                }else if(classify == "PHOTO"){
                    window.location.href="pt-photo.html?bookId="+bookId+"&userId="+userId+"&p="+p;
                }
                else{
                    window.location.href="book.html?bookId="+bookId+"&userId="+userId+"&p="+p;

                }
            }

        }
    });
}


function backToBookToDetailMonth(){
    $.ajax({
        url: "/wxbook/"+bookId,
        type: "get",
        beforeSend: function () {
            // Handle the beforeSend event
            loadding();
        },
        complete: function () {
            // Handle the complete event
            closeLoadding();
        },
        dataType: "json",
        success: function (book) {
            var bLayout=tools.getBookInfo(book.layouts).bookLayout;

            if(bLayout=="DoubleEdge"){
                window.location.href="db-book.html?bookId="+bookId+"&userId="+userId+"&editBackYear=" +editYear+ "&editBackMonth=" +editMonth+"&p="+p;

            }else  if(bLayout=="TimeAxis"){
                window.location.href="tl-book.html?bookId="+bookId+"&userId="+userId+"&editBackYear=" +editYear+ "&editBackMonth=" +editMonth+"&p="+p;

            }else  if(bLayout=="QZoneJournal"){
                window.location.href="jn-book.html?bookId="+bookId+"&userId="+userId+"&editBackYear=" +editYear+ "&editBackMonth=" +editMonth+"&p="+p;
            }else  if(bLayout=="WaterFallNew"){
                window.location.href="waterfallnew-book.html?bookId="+bookId+"&userId="+userId+"&editBackYear=" +editYear+ "&editBackMonth=" +editMonth+"&p="+p;

            }else{
                window.location.href="book.html?bookId="+bookId+"&userId="+userId+"&editBackYear=" +editYear+ "&editBackMonth=" +editMonth+"&p="+p;

            }
        }
    });
}

function getTodayMillion(){
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    var year=new Date().getFullYear();
    var todayMillion=new Date(year,month-1,day).getTime();
    return todayMillion;
}

function getYestdayMillion(){
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    var year=new Date().getFullYear();
    var yestMillion=new Date(year,month-1,day).getTime()-1000*60*60*24;
    return yestMillion;
}

function getTomorrowMillion(){
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    var year=new Date().getFullYear();
    var yestMillion=new Date(year,month-1,day).getTime()+1000*60*60*24;
    return yestMillion;
}

function getMonthMillion(){
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    var year=new Date().getFullYear();
    var yestMillion=new Date(year,month-1,1).getTime();
    return yestMillion;
}


function getFeiyeBlock(picUrl, p, name,qrcode) {
    return '<textarea class="feiye-message">' + removeAndoridMojiText(p) + '</textarea>';

}

function qrcodeBlock(qrcodeurl){
    if(qrcodeurl==null){
        return "";
    }else{
        return  '<img  class="feiye-qrcode" style="" width="75" height="75" src="' + qrcodeurl + '">';

    }
}

function clearBookAndScrollToTop(){
    $("#ajax-load-page").empty();
    $('html, body').animate({scrollTop:0}, 'slow');
}

var tools=(function(){
    var toolObj={};
    toolObj.bookCoverType=function(cn){
        var coverMaterial={
            "1":"白色特种纸",
            "2":"白色特种纸",
            "3":"白色特种纸",
            "4":"经典牛皮纸",
            "5":"经典牛皮纸",
            "6":"经典牛皮纸",
            "7":"特种纸",
            "8":"白色特种纸",
            "100":"白色特种纸"
        };
        return coverMaterial[cn]||"标准封面";
//        if (cn == 1) {
//            return "白色特种纸";
//        } else if (cn == 2) {
//            return "白色特种纸";
//        } else if (cn == 3) {
//            return "白色特种纸";
//        } else if (cn == 5) {
//            return "经典牛皮纸";
//        } else if (cn == 6) {
//            return "经典牛皮纸";
//        } else if (cn == 7) {
//            return "特种纸";
//        } else if (cn == 8) {
//            return "白色特种纸";
//        }else if (cn == 4) {
//            return "经典牛皮纸";
//        }else if (cn == 100) {
//            return "白色特种纸";
//        }else {
//            return "未知纸张";
//        }
    };
    toolObj.getBookInfo=function(layouts){

        //有问题的书
        if(!layouts){
            console.log("书没有layouts");
            return {
                totalPageNumber:"",
                bookLayout:"",
                createTime:"",
                splitPoints:"",
                lid:""
            }
        }
          //有问题的书
        if(layouts.length==0){
            console.log("书没有layouts");
            return {
                totalPageNumber:"",
                bookLayout:"",
                createTime:"",
                splitPoints:"",
                lid:""
            }
        }

        for (var i = 0; i < layouts.length; i++) {
            if (layouts[i].selected == true) {
                return {
                    totalPageNumber: layouts[i].totalPageNumber,
                    bookLayout: layouts[i].bookLayout,
                    createTime: layouts[i].createTime,
                    splitPoints: layouts[i].splitPoints,
                    lid: layouts[i].id
                }
            }
        }
        console.log("layouts没有select==true");
        return {
            totalPageNumber: "",
            bookLayout: "",
            createTime: "",
            splitPoints: "",
            lid: ""
        }
    }
    toolObj.getBookClassfy=function(classname,bindings){
        if(classname=="WECHAT"){
            return '微信书';
        }else if(classname=="QZONE"){
            return 'QQ空间书';

        }else if(classname=="WEIBO"){
            return '微博';

        }else if(classname=="QZONE_BLOG"){
            return 'qq日志';

        }else if(classname=="QZONE_ALBUM"){
            return 'qq相册';

        }else if(classname=="GALLERY"){
            return '相册时光书';

        }else if(classname=="CALENDAR"){
            return '台历';

        }else if(classname=="PHOTO"){
            if(bindings == 5){
                return '毕业册20*20';
            }else if(bindings == 6){
                return '毕业册跨p'
            }else{
                return '照片书18.5*18.5';
            }
        }else if(classname=="NEWPHOTO"){
                    return '新照片书'
        }else if(classname=="NEWCALENDAR"){
                    return '新台历'
        }else if(classname=="PRINTPHOTO"){
        			return '照片冲印'
        }else{
            return '未知';

        }
    };
    toolObj.getInnerpage=function(s){
        if(s==null||s==1){
            return '默认空白';
        }else if(s==2){
            return "云朵";
        }else if(s==3){
            return "咖啡";
        }else if(s==4){
            return "蒲公英";
        }else if(s==5){
            return "飞机";
        }
    };
    var isWechat = function () {
        return (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger");

    };

    toolObj.setImgByEquipment=function(desktopUrl,mobileUrl){
      if(isWechat()){
          return mobileUrl;
      }else{
          return desktopUrl;
      }
    };
    toolObj.imgLoadedAndPrint=function(){
        var nowPage=0;
        var imgLength= $("img").length;
        document.title="下载图片中";

        $("img").load(function(){
            console.log('downloadding:'+nowPage+'/'+imgLength);

            if(nowPage==(imgLength-5)){
                document.title="请按打印按钮";

            }
            if(++nowPage==imgLength){
                document.title="下载完成";
                    window.print();

            }
        });
    };
    toolObj.dateOpt=function(condition){
        if(condition=="yesterday"){
           return  turnDay(getYestdayMillion());
        }else if(condition=="tomorrow"){
           return  turnDay(getTomorrowMillion());
        }else if(condition=="today"){
           return  turnDay(getTodayMillion());
        }else if(condition=="month"){
           return  turnDay(getMonthMillion());
        }
    };
    toolObj.initByMillionTime=function(mls){
        var m=parseInt(mls);
        var nowYear=new Date(m).getFullYear();
        var nowMonth=new Date(m).getMonth()+1;
        var nowDay=new Date(m).getDate();
        var nowHour=new Date(m).getHours();
        var nowMinute=new Date(m).getMinutes();


        $("#year").val(nowYear);
        $("#month").val(nowMonth);
        $("#day").val(nowDay);
        $("#hour").val(nowHour);
        $("#minute").val(nowMinute);

    }

    return toolObj;

}());


/*积分星级的转换*/
function getTranslate(a)
{
    if(a>=500){
        return "images/level/level-6.png"
    }else if(a>=300){
        return "images/level/level-5.png"
    }else if(a>=100){
        return "images/level/level-4.png"
    }else if(a>=50){
        return "images/level/level-3.png"
    }else if(a>=20){
        return "images/level/level-2.png"
    }else{
        return "images/level/level-1.png"
    }
}

/*初始化星级*/
getdetail();
var userId;
function getdetail() {
    $.ajax({
        type: "get",
        url: "/point?sfId=" + userId,
        success: function (msg) {
            /*积分星级显示*/
            $(".ljn-img-level").attr("src", getTranslate(msg.score));
        }
    });
}

/*点击星级跳转页面*/
$(document).on("click",".ljn-img-level-pc",function(){
    window.location.href="http://mp.weixin.qq.com/s?__biz=MzAxNDA1Mzk2Mg==&mid=402140711&idx=1&sn=e285bd4bcf0a36dd6866278d4e01a3b7#rd";
});



/*数字月份转换成中文月份*/

function monthToWord(month){
    var m = parseInt(month);
    if(m == 1){
        return '一月'
    }else if(m == 2){
        return '二月'
    }else if(m == 3){
        return '三月'
    }else if(m == 4){
        return '四月'
    }else if(m == 5){
        return '五月'
    }else if(m == 6){
        return '六月'
    }else if(m == 7){
        return '七月'
    }else if(m == 8){
        return '八月'
    }else if(m == 9){
        return '九月'
    }else if(m == 10){
        return '十月'
    }else if(m == 11){
        return '十一月'
    }else if(m == 12){
        return '十二月'
    }
}

function SingleBr(i){
    if((i+1)%2 == 1){
        return '</br>'
    }else{
        return ''
    }
}

function DoubleBr(i){
    if((i+1)%2 == 0){
        return '</br>'
    }else{
        return ''
    }
}

function isMobile() {
    var index = navigator.appVersion.indexOf("Mobile");
    return (index > -1);
}