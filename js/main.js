NProgress.start();
NProgress.done();

(function () {

    window.onload=function () {
        $(".progress").animate({
            "opacity":0
        })
        $("body").css({
            "overflow-x":"auto"
        })
    };
    $(".post-fix").animate({
        "opacity":0
    },1000)
    setTimeout(function () {
        $(".progress").animate({
            "opacity":0

        })
            .css({
                "display":"none"
            })
    },1000)
})();
$(function(){
    $(".lazy").lazyload({
        effect : "fadeIn"
    });
});

function dowmdiv() {
    var contentHeight = document.body.scrollHeight,//网页正文全文高度
        winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        $(".up").css({
            "display":"none"
        });
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $("#bottom-outer").css({
            "position":"absolute",
            "bottom":0,
            "left":0
        });
    } else {
        $("#bottom-outer").css({
            "position":"relative"
        });
        $("#top-button").css({
            "display":"block"
        });
    }
}


(function () {
    var weight=$("body").width();
    if(weight<=768){
        $(function () {
            function friendsload() {
                var times=0;
                var left=(weight-250)/2+"px";

                $(".friends-link").each(function () {
                    var friend=$(this);
                    var time=times*200;
                    times++;
                    setTimeout(function () {
                        friend.animate({
                            "margin-left":left,
                            "opacity":1
                        },300)
                    },time);

                });
            }
            $(document).on('pjax:end', function() {
                friendsload();
            })
            window.onload=friendsload();
        });
    }else {
        $(function () {
            function friendsload() {
                var times=0;
                $(".friends-link").each(function () {
                    var friend=$(this);
                    times++;
                    var time=times*200;
                    setTimeout(function () {
                        friend.animate({
                            "margin-left":"150px",
                            "opacity":1
                        },300)
                    },time);

                });
            }
            $(document).on('pjax:end', function() {
                friendsload();
            })
            window.onload=friendsload();
           /* $(".post-header").animate({
                "margin-top":"100px"
            },300)*/
        });
    }
})();

(function () {
    $('.button-collapse').sideNav({
            menuWidth: 250, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
        }
    );
    $(document).on('pjax:end', function() {
        $('.button-collapse').sideNav('hide');
    })
})();

//侧边栏下拉列表绑定事件
(function () {
        $(".dropdown-btn").click(function () {
            var height=$(this).next().css("display");
            if(height=="none"){
                $(this).next().slideDown();
                $(this).find(".dropdown-ico").rotate({animateTo: 180});
            }else{
                $(this).next().slideUp();
                $(this).find(".dropdown-ico").rotate({animateTo: 0});
            }

        })
})();


//回到顶部
(function () {
        $("#top-button").click(function () {
            $('html,body').animate({
                scrollTop:0
            },500);
        });

})();

//foot固定在底部
(function(){

    var contentHeight = document.body.scrollHeight,//网页正文全文高度
        winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        $(".up").css({
            "display":"none"
        });
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $("#bottom-outer").css({
            "position":"absolute",
            "bottom":0,
            "left":0
        });
    } else {
        $("#bottom-outer").css({
            "position":"relative"
        });
        $("#top-button").css({
            "display":"block"
        });
    }
})();

var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text()
                };
            }).get();
            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);
            $input.addEventListener('input', function(){
                var str='<ul class=\"search-result-list\">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // perform local searching
                datas.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // only match artiles with not empty titles and contents
                    if(data_title != '' && data_content != '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);
                            if( index_title < 0 && index_content < 0 ){
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                            }
                        });
                    }
                    // show search results
                    if (isMatch) {
                        str += "<li><a href='"+ data_url +"' class='search-result-title' target='_blank'>" + data_title ;
                        var content = data.content.trim().replace(/<[^>]+>/g,"");
                        if (first_occur >= 0) {
                            // cut out characters
                            var start = first_occur - 6;
                            var end = first_occur + 6;
                            if(start < 0){
                                start = 0;
                            }
                            if(start == 0){
                                end = 10;
                            }
                            if(end > content.length){
                                end = content.length;
                            }
                            var match_content = content.substr(start, end);
                            // highlight all keywords
                            keywords.forEach(function(keyword){
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                            });
                            str += "<p class=\"search-result\">" + match_content +"...</p>"+"</a>"
                        }
                    }
                });
                $resultContent.innerHTML = str;
            })
        }
    })
};

var inputArea = document.querySelector("#local-search-input");
var getSearchFile = function(){
    var path = "/search.xml";
    searchFunc(path, 'local-search-input', 'local-search-result');
};

inputArea.onfocus = function(){ getSearchFile() };
inputArea.onkeydown = function(){ if(event.keyCode==13) return false};

$("#local-search-result").bind("DOMNodeRemoved DOMNodeInserted", function(e) {
    if (!$(e.target).text()) {
        $(".no-result").show();
    } else {
        $(".no-result").hide();
    }
});

(function($) {
    $.fn.exist = function(){
        if($(this).length>=1){
            return true;
        }
        return false;
    };
})(jQuery);

(function () {
    $(".post-toc-btn").click(function () {
        if($(".post-toc").exist()){
            $(".post-toc-box").fadeToggle()
        }else {
            $(".post-toc-none").fadeToggle()
        }

    })
})();


(function () {
    var $root = $('html, body');
    $('.post-toc-link').click(function() {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500);
        return false;
    });
})();
(function () {
   var links=$(".post-author-link");
   var button=$(".post-author-button");
   button.click(function (){
       if(links.css("display")=== "none"){
           links.css({
               "display":"block"
           }).animate({
               "right":"60px",
               "opacity":1
           },500)
       }else {
           links.animate({
               "opacity":0
           },500)
           setTimeout(function (){

               links.css({
                   "display":"none",
                   "right":"100px"
               })
           },500)
       }
   })
})();

//节流函数
var throttle = function (fn, delay, atleast) {
    var timer = null;
    var previous = null;

    return function () {
        var now = +new Date();

        if ( !previous ) previous = now;
        if ( atleast && now - previous > atleast ) {
            fn();
            // 重置上一次开始时间为本次结束时间
            previous = now;
            clearTimeout(timer);
        } else {
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn();
                previous = null;
            }, delay);
        }
    }
};

(function () {
    var up=$(".up");
    window.onscroll = function () {
        var top=$(window).scrollTop(),
            height=$(window).height(),
            botton =$(document).height() - top-height;
        if (top>=height-80){
            if (botton<=90){
                up.removeClass("upinbody");
                up.addClass("upinfoot");
            }else {
                up.removeClass("upinfoot");
                up.addClass("upinbody");
            }
            up.fadeIn(500);
        }else if (top<=height-80){
            up.fadeOut(500);
        }
    }
})();

/*!
 * An jQuery | zepto plugin for lazy loading images.
 * author -> jieyou
 * see https://github.com/jieyou/lazyload
 * use some tuupola's code https://github.com/tuupola/jquery_lazyload (BSD)
 * use component's throttle https://github.com/component/throttle (MIT)
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(window.jQuery||window.Zepto)}(function(a,b){function g(){}function h(a,b){var e;return e=b._$container==d?("innerHeight"in c?c.innerHeight:d.height())+d.scrollTop():b._$container.offset().top+b._$container.height(),e<=a.offset().top-b.threshold}function i(b,e){var f;return f=e._$container==d?d.width()+(a.fn.scrollLeft?d.scrollLeft():c.pageXOffset):e._$container.offset().left+e._$container.width(),f<=b.offset().left-e.threshold}function j(a,b){var c;return c=b._$container==d?d.scrollTop():b._$container.offset().top,c>=a.offset().top+b.threshold+a.height()}function k(b,e){var f;return f=e._$container==d?a.fn.scrollLeft?d.scrollLeft():c.pageXOffset:e._$container.offset().left,f>=b.offset().left+e.threshold+b.width()}function l(a,b){var c=0;a.each(function(d,e){function g(){f.trigger("_lazyload_appear"),c=0}var f=a.eq(d);if(!(f.width()<=0&&f.height()<=0||"none"===f.css("display")))if(b.vertical_only)if(j(f,b));else if(h(f,b)){if(++c>b.failure_limit)return!1}else g();else if(j(f,b)||k(f,b));else if(h(f,b)||i(f,b)){if(++c>b.failure_limit)return!1}else g()})}function m(a){return a.filter(function(b,c){return!a.eq(b)._lazyload_loadStarted})}function n(a,b){function h(){f=0,g=+new Date,e=a.apply(c,d),c=null,d=null}var c,d,e,f,g=0;return function(){c=this,d=arguments;var a=new Date-g;return f||(a>=b?h():f=setTimeout(h,b-a)),e}}var f,c=window,d=a(c),e={threshold:0,failure_limit:0,event:"scroll",effect:"show",effect_params:null,container:c,data_attribute:"original",data_srcset_attribute:"original-srcset",skip_invisible:!0,appear:g,load:g,vertical_only:!1,check_appear_throttle_time:300,url_rewriter_fn:g,no_fake_img_loader:!1,placeholder_data_img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC",placeholder_real_img:"http://ditu.baidu.cn/yyfm/lazyload/0.0.1/img/placeholder.png"};f=function(){var a=Object.prototype.toString;return function(b){return a.call(b).replace("[object ","").replace("]","")}}(),a.fn.hasOwnProperty("lazyload")||(a.fn.lazyload=function(b){var i,j,k,h=this;return a.isPlainObject(b)||(b={}),a.each(e,function(g,h){-1!=a.inArray(g,["threshold","failure_limit","check_appear_throttle_time"])?"String"==f(b[g])?b[g]=parseInt(b[g],10):b[g]=h:"container"==g?(b.hasOwnProperty(g)?b[g]==c||b[g]==document?b._$container=d:b._$container=a(b[g]):b._$container=d,delete b.container):!e.hasOwnProperty(g)||b.hasOwnProperty(g)&&f(b[g])==f(e[g])||(b[g]=h)}),i="scroll"==b.event,k=0==b.check_appear_throttle_time?l:n(l,b.check_appear_throttle_time),j=i||"scrollstart"==b.event||"scrollstop"==b.event,h.each(function(c,d){var e=this,f=h.eq(c),i=f.attr("src"),k=f.attr("data-"+b.data_attribute),l=b.url_rewriter_fn==g?k:b.url_rewriter_fn.call(e,f,k),n=f.attr("data-"+b.data_srcset_attribute),o=f.is("img");return 1==f._lazyload_loadStarted||i==l?(f._lazyload_loadStarted=!0,void(h=m(h))):(f._lazyload_loadStarted=!1,o&&!i&&f.one("error",function(){f.attr("src",b.placeholder_real_img)}).attr("src",b.placeholder_data_img),f.one("_lazyload_appear",function(){function i(){d&&f.hide(),o?(n&&f.attr("srcset",n),l&&f.attr("src",l)):f.css("background-image",'url("'+l+'")'),d&&f[b.effect].apply(f,c?b.effect_params:[]),h=m(h)}var d,c=a.isArray(b.effect_params);f._lazyload_loadStarted||(d="show"!=b.effect&&a.fn[b.effect]&&(!b.effect_params||c&&0==b.effect_params.length),b.appear!=g&&b.appear.call(e,f,h.length,b),f._lazyload_loadStarted=!0,b.no_fake_img_loader||n?(b.load!=g&&f.one("load",function(){b.load.call(e,f,h.length,b)}),i()):a("<img />").one("load",function(){i(),b.load!=g&&b.load.call(e,f,h.length,b)}).attr("src",l))}),void(j||f.on(b.event,function(){f._lazyload_loadStarted||f.trigger("_lazyload_appear")})))}),j&&b._$container.on(b.event,function(){k(h,b)}),d.on("resize load",function(){k(h,b)}),a(function(){k(h,b)}),this})});
// VERSION: 2.3 LAST UPDATE: 11.07.2013
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * Website: http://code.google.com/p/jqueryrotate/ 
 */
(function(k){for(var d,f,l=document.getElementsByTagName("head")[0].style,h=["transformProperty","WebkitTransform","OTransform","msTransform","MozTransform"],g=0;g<h.length;g++)void 0!==l[h[g]]&&(d=h[g]);d&&(f=d.replace(/[tT]ransform/,"TransformOrigin"),"T"==f[0]&&(f[0]="t"));eval('IE = "v"=="\v"');jQuery.fn.extend({rotate:function(a){if(0!==this.length&&"undefined"!=typeof a){"number"==typeof a&&(a={angle:a});for(var b=[],c=0,d=this.length;c<d;c++){var e=this.get(c);if(e.Wilq32&&e.Wilq32.PhotoEffect)e.Wilq32.PhotoEffect._handleRotation(a);
else{var f=k.extend(!0,{},a),e=(new Wilq32.PhotoEffect(e,f))._rootObj;b.push(k(e))}}return b}},getRotateAngle:function(){for(var a=[],b=0,c=this.length;b<c;b++){var d=this.get(b);d.Wilq32&&d.Wilq32.PhotoEffect&&(a[b]=d.Wilq32.PhotoEffect._angle)}return a},stopRotate:function(){for(var a=0,b=this.length;a<b;a++){var c=this.get(a);c.Wilq32&&c.Wilq32.PhotoEffect&&clearTimeout(c.Wilq32.PhotoEffect._timer)}}});Wilq32=window.Wilq32||{};Wilq32.PhotoEffect=function(){return d?function(a,b){a.Wilq32={PhotoEffect:this};
this._img=this._rootObj=this._eventObj=a;this._handleRotation(b)}:function(a,b){this._img=a;this._onLoadDelegate=[b];this._rootObj=document.createElement("span");this._rootObj.style.display="inline-block";this._rootObj.Wilq32={PhotoEffect:this};a.parentNode.insertBefore(this._rootObj,a);if(a.complete)this._Loader();else{var c=this;jQuery(this._img).bind("load",function(){c._Loader()})}}}();Wilq32.PhotoEffect.prototype={_setupParameters:function(a){this._parameters=this._parameters||{};"number"!==
typeof this._angle&&(this._angle=0);"number"===typeof a.angle&&(this._angle=a.angle);this._parameters.animateTo="number"===typeof a.animateTo?a.animateTo:this._angle;this._parameters.step=a.step||this._parameters.step||null;this._parameters.easing=a.easing||this._parameters.easing||this._defaultEasing;this._parameters.duration=a.duration||this._parameters.duration||1E3;this._parameters.callback=a.callback||this._parameters.callback||this._emptyFunction;this._parameters.center=a.center||this._parameters.center||
["50%","50%"];this._rotationCenterX="string"==typeof this._parameters.center[0]?parseInt(this._parameters.center[0],10)/100*this._imgWidth*this._aspectW:this._parameters.center[0];this._rotationCenterY="string"==typeof this._parameters.center[1]?parseInt(this._parameters.center[1],10)/100*this._imgHeight*this._aspectH:this._parameters.center[1];a.bind&&a.bind!=this._parameters.bind&&this._BindEvents(a.bind)},_emptyFunction:function(){},_defaultEasing:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-
1)+c},_handleRotation:function(a,b){d||this._img.complete||b?(this._setupParameters(a),this._angle==this._parameters.animateTo?this._rotate(this._angle):this._animateStart()):this._onLoadDelegate.push(a)},_BindEvents:function(a){if(a&&this._eventObj){if(this._parameters.bind){var b=this._parameters.bind,c;for(c in b)b.hasOwnProperty(c)&&jQuery(this._eventObj).unbind(c,b[c])}this._parameters.bind=a;for(c in a)a.hasOwnProperty(c)&&jQuery(this._eventObj).bind(c,a[c])}},_Loader:function(){return IE?function(){var a=
this._img.width,b=this._img.height;this._imgWidth=a;this._imgHeight=b;this._img.parentNode.removeChild(this._img);this._vimage=this.createVMLNode("image");this._vimage.src=this._img.src;this._vimage.style.height=b+"px";this._vimage.style.width=a+"px";this._vimage.style.position="absolute";this._vimage.style.top="0px";this._vimage.style.left="0px";this._aspectW=this._aspectH=1;this._container=this.createVMLNode("group");this._container.style.width=a;this._container.style.height=b;this._container.style.position=
"absolute";this._container.style.top="0px";this._container.style.left="0px";this._container.setAttribute("coordsize",a-1+","+(b-1));this._container.appendChild(this._vimage);this._rootObj.appendChild(this._container);this._rootObj.style.position="relative";this._rootObj.style.width=a+"px";this._rootObj.style.height=b+"px";this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;for(this._eventObj=this._rootObj;a=this._onLoadDelegate.shift();)this._handleRotation(a,
!0)}:function(){this._rootObj.setAttribute("id",this._img.getAttribute("id"));this._rootObj.className=this._img.className;this._imgWidth=this._img.naturalWidth;this._imgHeight=this._img.naturalHeight;var a=Math.sqrt(this._imgHeight*this._imgHeight+this._imgWidth*this._imgWidth);this._width=3*a;this._height=3*a;this._aspectW=this._img.offsetWidth/this._img.naturalWidth;this._aspectH=this._img.offsetHeight/this._img.naturalHeight;this._img.parentNode.removeChild(this._img);this._canvas=document.createElement("canvas");
this._canvas.setAttribute("width",this._width);this._canvas.style.position="relative";this._canvas.style.left=-this._img.height*this._aspectW+"px";this._canvas.style.top=-this._img.width*this._aspectH+"px";this._canvas.Wilq32=this._rootObj.Wilq32;this._rootObj.appendChild(this._canvas);this._rootObj.style.width=this._img.width*this._aspectW+"px";this._rootObj.style.height=this._img.height*this._aspectH+"px";this._eventObj=this._canvas;for(this._cnv=this._canvas.getContext("2d");a=this._onLoadDelegate.shift();)this._handleRotation(a,
!0)}}(),_animateStart:function(){this._timer&&clearTimeout(this._timer);this._animateStartTime=+new Date;this._animateStartAngle=this._angle;this._animate()},_animate:function(){var a=+new Date,b=a-this._animateStartTime>this._parameters.duration;if(b&&!this._parameters.animatedGif)clearTimeout(this._timer);else{if(this._canvas||this._vimage||this._img)a=this._parameters.easing(0,a-this._animateStartTime,this._animateStartAngle,this._parameters.animateTo-this._animateStartAngle,this._parameters.duration),
this._rotate(~~(10*a)/10);this._parameters.step&&this._parameters.step(this._angle);var c=this;this._timer=setTimeout(function(){c._animate.call(c)},10)}this._parameters.callback&&b&&(this._angle=this._parameters.animateTo,this._rotate(this._angle),this._parameters.callback.call(this._rootObj))},_rotate:function(){var a=Math.PI/180;return IE?function(a){this._angle=a;this._container.style.rotation=a%360+"deg";this._vimage.style.top=-(this._rotationCenterY-this._imgHeight/2)+"px";this._vimage.style.left=
-(this._rotationCenterX-this._imgWidth/2)+"px";this._container.style.top=this._rotationCenterY-this._imgHeight/2+"px";this._container.style.left=this._rotationCenterX-this._imgWidth/2+"px"}:d?function(a){this._angle=a;this._img.style[d]="rotate("+a%360+"deg)";this._img.style[f]=this._parameters.center.join(" ")}:function(b){this._angle=b;b=b%360*a;this._canvas.width=this._width;this._canvas.height=this._height;this._cnv.translate(this._imgWidth*this._aspectW,this._imgHeight*this._aspectH);this._cnv.translate(this._rotationCenterX,
this._rotationCenterY);this._cnv.rotate(b);this._cnv.translate(-this._rotationCenterX,-this._rotationCenterY);this._cnv.scale(this._aspectW,this._aspectH);this._cnv.drawImage(this._img,0,0)}}()};IE&&(Wilq32.PhotoEffect.prototype.createVMLNode=function(){document.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{return!document.namespaces.rvml&&document.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),function(a){return document.createElement("<rvml:"+a+' class="rvml">')}}catch(a){return function(a){return document.createElement("<"+
a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}}())})(jQuery);
