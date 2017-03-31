(function () {
    var weight=$("body").width();
    if(weight<=768){
        $(document).on("pagecreate","body",function(){
            $("body").on("swiperight",function(){
                $("#menu-outer").animate({
                    "left":0
                },500);
                $(".clothes").animate({
                    "left":"300px"
                },500);
                $(".background").css({
                    "display":"block"
                });
                $(".background").animate({
                    "opacity":"1"
                },500);
                $(".nav-btn").rotate({animateTo: 180});
                $(".nav-btn").animate({
                    "left":"330px"
                },500);
                $("body").css({
                    "overflow-y":"hidden"
                });
                $("#menu-outer").css({
                    "overflow-y":"auto"
                });
                //return false;
            });
            $("body").on("swipeleft",function(){
                $("body").css({
                    "overflow-y":"auto"
                });
                $("#menu-outer").animate({
                    "left":"-300px"
                },500);
                $(".clothes").animate({
                    "left":0
                },500);
                $(".background").animate({
                    "opacity":"0"
                },500);
                setTimeout(function () {
                    $(".background").css({
                        "display":"none"
                    });
                },500);
                $(".nav-btn").animate({
                    "left":"30px"
                },500);
                $(".nav-btn").rotate({animateTo: 0});

                $(".nav-dropdown").slideUp();
                $(".dropdown-ico").rotate({animateTo: 0});
            });
        });
    }
})();


(function () {
        //禁止x轴滚动条
        $("body").css({
            "overflow-x":"hidden"
        });
        var height=$(window).height();

        $(".background").css({
            "height":height
        })
})();

//导航栏弹出绑定事件
/*(function () {
        $(".nav-btn").click(function () {
            $("body").css({
                "overflow-y":"hidden"
            });
            $("#menu-outer").animate({
                "left":0
            },500);
            $("#menu-outer").css({
                "overflow-y":"auto"
            });
            $(".clothes").animate({
                "left":"300px"
            },500);
            $(".background").css({
                "display":"block"
            });
            $(".background").animate({
                "opacity":"1"
            },500);
            $(this).rotate({animateTo: 180},200);
            $(this).animate({
                "left":"330px"
            },500);
        });
})();*/
(function () {
    $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true // Choose whether you can drag to open on touch screens
        }
    );
    $(".nav-btn").click(function () {
        $('.button-collapse').sideNav("show");

    })
})();


$(function () {
    function archives() {
        $("#archives").click(function () {
            var height=$("#dropdown").css("display");
            if(height=="none"){
                $("#dropdown").slideDown();
                $(".dropdown-ico").rotate({animateTo: 180});
            }else{
                $("#dropdown").slideUp();
                $(".dropdown-ico").rotate({animateTo: 0});
            }

        })
    }
    archives()
});

//导航栏收起绑定事件
/*(function () {
        $(".background").click(function () {
            $('.button-collapse').sideNav("hide");
            $("body").css({
                "overflow-y":"auto"
            });
            $(".clothes").animate({
                "left":0
            },500);
            $(".background").animate({
                "opacity":"0"
            },500);
            setTimeout(function () {
                $(".background").css({
                    "display":"none"
                });
            },500);
            $(".nav-btn").animate({
                "left":"30px"
            },500);
            $(".nav-btn").rotate({animateTo: 0});

            $(".nav-dropdown").slideUp();
            $(".dropdown-ico").rotate({animateTo: 0});
            //return false;
        });
})();*/

//回到顶部
$(function () {
    function top() {
        $("#top-button").click(function () {
            $('html,body').animate({
                scrollTop:$($.attr(this,'href')).offset().top
            },500);
            return false;
        });
    }
    top()
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

