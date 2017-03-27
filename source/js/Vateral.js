$(function () {
    function pageready() {
        //禁止x轴滚动条
        $("body").css({
            "overflow-x":"hidden"
        });

        //滚动条滚动时获取左侧导航栏以及背景的top
        $(window).scroll(function () {
            var top=$(window).scrollTop();
            $("#menu-outer").css({
                "top":top
            });
            $(".background").css({
             "top":top
             });
        });

        //动态获取整个页面高度，设置给导航栏和背景
        var height=$(window).height();
        $(window).resize(function () {
            var height=$(window).height();
            $("#menu-outer").css({
                "height":height
            });
             $(".background").css({
             "height":height
             });
        });
        $("#menu-outer").css({
            "height":height
        });
         $(".background").css({
         "height":height
         });
    }
    pageready()
});

//导航栏弹出绑定事件
$(function () {
    function nanup() {
        $(".nav-btn").click(function () {
            $("#menu-outer").animate({
                "left":0
            },500);
            $("#bottom-outer").animate({
                "left":"300px"
            },500);
            $(".background").css({
                "display":"block"
            });
            $(this).rotate({animateTo: 180});
            $(this).animate({
                "left":"330px"
            },500);
            $("body").css({
                "overflow-y":"hidden"
            });
            return false;
        });
    }
    nanup()
});

//导航栏收起绑定事件
$(function () {
    function navdown() {
        $(".background").click(function () {
            $("#menu-outer").animate({
                "left":"-300px"
            },500);
            $("#bottom-outer").animate({
                "left":0
            },500);
            $(".background").css({
                "display":"none"
            });
            $(".nav-btn").animate({
                "left":"30px"
            },500);
            $(".nav-btn").rotate({animateTo: 0});
            /*$(".left-list-out ul li").slideUp();
            $(".left-list-down").rotate({animateTo: 0});*/
        });
    }
    navdown();
});



//foot固定在底部
$(function(){
    function footerPosition(){
        $("#bottom-outer").removeClass("fixed-bottom");
        var contentHeight = document.body.scrollHeight,//网页正文全文高度
            winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
        if(!(contentHeight > winHeight)){
            //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
            $("#bottom-outer").addClass("fixed-bottom");
        } else {
            $("#bottom-outer").removeClass("fixed-bottom");
        }
    }
    footerPosition();
    $(window).resize(footerPosition);
});

