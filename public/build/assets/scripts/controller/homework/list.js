define([],function(){var apiBaseUrl=avalon.illyGlobal&&avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token,slidersUrlPrefix="./assets/images",listSliders=[{image:slidersUrlPrefix+"/slider-task.png",title:"task",href:"./task.html"},{image:slidersUrlPrefix+"/slider-mistake.png",title:"mistakeList",href:"#!/mistake/list"},{image:slidersUrlPrefix+"/slider-question.png",title:"ask",href:"#!/mistake/list"}],list=avalon.define({$id:"list",sliders:listSliders,renderSlider:function(){setTimeout(function(){$(".illy-container #slider").slider({loop:!0,ready:function(){setTimeout(function(){avalon.$(".illy-container #slider").style.visibility="visible"},16)},"done.dom":function(){}})},32)},noHomeworkContent:!1,noContentText:"恭喜你小学霸，完成了所有作业，更多精彩，敬请期待!",showLoader:!0,homework:[],previews:[],offset:0,fetchData:function(type){$http.ajax({method:"",url:apiBaseUrl+type,data:{},headers:{Authorization:"Bearer "+token},dataType:"json",success:function(lists){list[type]=lists,setTimeout(function(){var newLists=list.homework;newLists&&0===newLists.length&&0===newLists.length&&(list.noHomeworkContent=!0)},200)},error:function(res){avalon.illyError("ajax error",res);var newLists=list.homework;0===newLists.length&&(list.noHomeworkContent=!0)},ajaxFail:function(res){avalon.illyError("ajax failed",res);var newLists=list.homework;0===newLists.length&&(list.noHomeworkContent=!0)}})}});return avalon.controller(function($ctrl){$ctrl.$onBeforeUnload=function(){},$ctrl.$onEnter=function(){if(list.showLoader&&setTimeout(function(){list.showLoader=!1},500),!list.showLoader){var loader=document.querySelector(".loader");loader&&(loader.style.display="none")}list.fetchData("homework"),void 0!==avalon.vmodels.question&&(avalon.vmodels.question.starter=!0)},$ctrl.$onRendered=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=list.js.map