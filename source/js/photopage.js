/**
 * Created by wangchengyu on 2017/5/3.
 */

var boxes=$('.portfolio-item');

$(document).ready(function () {


    boxes.each(function () {

        var _this=$(this);
        var small=$(this).find(".img-small");
        var small_image = new Image();
        small_image.src=small[0].src;
        var image = new Image();
        var father =$(this).find(".detail");
        image.src=$(this).attr("href");


        small_image.onload = function() {
            small.animate({
                "opacity":1
            },800);

            setTimeout(function () {
                _this.parent(".portfolio-group ").css({
                    "backgroundImage":"none"
                })
            },1200);
            image.onload = function () {
                EXIF.getData(image, function(){
                    var  Model = EXIF.getTag(image, "Model");//相机
                    var  FocalLength = EXIF.getTag(image, "FocalLength");//焦段
                    var  FNumber = EXIF.getTag(image, "FNumber");//光圈
                    var  ExposureTime = 1/EXIF.getTag(image, "ExposureTime");//快门
                    var  ISOSpeedRatings = EXIF.getTag(image, "ISOSpeedRatings");//ISO
                    if (Model==undefined ||FocalLength==undefined ||FNumber==undefined ||ExposureTime==undefined ||ISOSpeedRatings==undefined ){
                        Model="暂无数据";
                        FocalLength="暂无数据";
                        FNumber="暂无数据";
                        ExposureTime="暂无数据";
                        ISOSpeedRatings="暂无数据"
                    }
                    father.children(".Model").empty().append("相机："+Model);
                    father.children(".FocalLength").empty().append("焦段："+FocalLength);
                    father.children(".FNumber").empty().append("光圈："+FNumber);
                    father.children(".ExposureTime").empty().append("快门："+ExposureTime);
                    father.children(".ISOSpeedRatings").empty().append("感光度："+ISOSpeedRatings);
                })
            }
        }
    })

})