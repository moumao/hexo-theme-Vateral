//载入动画
$(function () {
    function loadings() {
        $("body").css({
            "overflow-y":"hidden"
        });
        setTimeout(function(){
            var loader = document.getElementsByClassName("loader")[0];
            loader.className="loader fadeout" ;//使用渐隐的方法淡出loading page
            $("body").css({
                "overflow-y":"auto"
            });
            setTimeout(function(){
                loader.style.display="none";
            },500)
        },500);//强制显示loading
    }
    window.onload=loadings();
});

(function () {
    var weight=$("body").width();
    if(weight<=768){
        (function () {
            $('.button-collapse').sideNav({
                    menuWidth: 240, // Default is 240
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    draggable: false // Choose whether you can drag to open on touch screens
                }
            );
            $(".nav-btn").click(function () {
                $('.button-collapse').sideNav("show");

            })
        })();
    }else {
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
    }
})();

//侧边栏初始化以及绑定事件


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
                        str += "<li><a href='"+ data_url +"' class='search-result-title' target='_blank'>" + data_title +"</a>";
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
                            str += "<p class=\"search-result\">" + match_content +"...</p>"
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
