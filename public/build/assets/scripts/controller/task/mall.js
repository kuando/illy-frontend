define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token;null===token&&avalon.illyGlobal.noTokenHandler();var wx=avalon.wx,resourcePrefix="http://resource.hizuoye.com/",limit=6,mall=avalon.define({$id:"mall",visited:!1,lists:[],rules:"",offset:0,btnShowMore:!0,fetchRemoteData:function(apiArgs,data,target,type){$http.ajax({url:apiBaseUrl+apiArgs,headers:{Authorization:"Bearer "+token},data:data,success:function(res){mall[target]="concat"===type?mall[target].concat(res):res},error:function(res){avalon.log("mall ajax error when fetch data"+res)},ajaxFail:function(res){avalon.log("mall ajax failed when fetch data"+res)}})},showMore:function(e){e.preventDefault();var page=2;return mall.offset<limit?void(mall.btnShowMore=!1):(mall.offset=mall.offset+limit*(page-1),void mall.fetchRemoteData("score/mall",{offset:mall.offset},"lists","concat"))},rendered:function(){for(var currentImgSrc,imgSrcLists=[],imageView2="?imageView2/2/w/400/h/400",i=0,len=mall.lists.length;len>i;i++)imgSrcLists.push(resourcePrefix+mall.lists[i].imageKey+imageView2);$(".img-wrapper").on("click","img",function(){currentImgSrc=$(this)[0].src.split("?")[0]+imageView2,wx.previewImage({current:currentImgSrc,urls:imgSrcLists})})}});return avalon.controller(function($ctrl){$ctrl.$onBeforeUnload=function(){},$ctrl.$onEnter=function(){mall.visited=avalon.vmodels.root.currentIsVisited,mall.btnShowMore=mall.offset<=limit?!1:!0,mall.fetchRemoteData("score/mall",{},"lists"),mall.fetchRemoteData("score/exchangeInstruction",{},"rules"),setTimeout(function(){},1e3)},$ctrl.$onRendered=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=mall.js.map