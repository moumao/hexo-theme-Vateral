//开启懒加载
function lazy() {
    $(".lazy").lazyload();
}

//footer固定在底部
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
//post页面toc绑定事件
function toc(){
    $(".post-toc-btn").click(function () {
        if($(".post-toc").exist()){
            $(".post-toc-box").fadeToggle()
        }else {
            $(".post-toc-none").fadeToggle()
        }
    });
    var $root = $('html, body');
    $('.post-toc-link').click(function() {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500);
        return false;
    });
}
toc();
//分享链接按钮绑定事件
function links () {
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
            },500);
            setTimeout(function (){
                links.css({
                    "display":"none",
                    "right":"100px"
                })
            },500)
        }
    })
}

//up按钮
(function () {
    $("#top-button").click(function () {
        $('html,body').animate({
            scrollTop:0
        },500);
    });
    var up=$(".up");
    window.onscroll = function () {
        var top=$(window).scrollTop(),
            height=$(window).height(),
            botton =$(document).height() - top-height;
        if (top>=height-400){
            if (botton<=90){
                up.removeClass("upinbody");
                up.addClass("upinfoot");
            }else {
                up.removeClass("upinfoot");
                up.addClass("upinbody");
            }
            up.fadeIn(100)
        }else if (top<=height-400){
            up.fadeOut(500);
        }
    }
})();
//菜单图标改变
function menu() {
    var url = window.location.href;
    var regex = /[-:\\/.][1-9][0-9][0-9][0-9][-:\\/.][0-9][0-9][-:\\/.][0-9][0-9][-:\\/.]/;
    var menu = $(".nav-btn");//span图标
    var menuButton = $("#menu");//按钮
    var home=document.getElementById("menu").dataset.home;
    if(regex.test(url)){//匹配为文章
        menuButton.unbind();
        menu.addClass("back");
        menuButton.on("click",function(){
            if (window.history.length<=2){
                menuButton.attr("href","/")
            }else {
                menuButton.attr("href","javascript:void(0)")
                window.history.back();
            }
        });
    }else {
        menu.removeClass("back");
        menuButton.unbind();
        setTimeout(function(){
            menuButton.sideNav({
                    menuWidth: 250,
                    edge: 'left',
                    closeOnClick: false,
                    draggable: true
                }
            );
        })
    }
}
//左侧菜单栏配置
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

//友链界面载入动画
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
            });
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
            });
            window.onload=friendsload();
        });
    }
})();

//搜索栏算法
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