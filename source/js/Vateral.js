//载入动画
$(function () {
    function loadings() {
       $(".progress").css({
           "display":"none"
       })
    }
    window.onload=loadings();
});

//侧边栏初始化以及绑定事件
(function () {
    $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: false // Choose whether you can drag to open on touch screens
        }
    );
    $(".nav-btn").click(function () {
        $('.button-collapse').sideNav("show");

    })
})();

//侧边栏下拉列表绑定事件
(function () {
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
})();

//移动端侧边栏滑动事件监听
(function () {
    var weight=$("body").width();
    if(weight<=768){
        $(document).on("pagecreate","body",function(){
            $("body").on("swiperight",function(){
                $('.button-collapse').sideNav("show");
            });
            $("body").on("swipeleft",function(){
                $('.button-collapse').sideNav("hide");
            });
        });
    }
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

