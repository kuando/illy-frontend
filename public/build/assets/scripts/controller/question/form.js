define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token,form=avalon.define({$id:"form",visited:!1,fetchRemoteData:function(apiArgs,data,target){return form.visited&&needCache?void(avalon.vmodels.root.currentRendered=!0):void $http.ajax({url:apiBaseUrl+apiArgs+"",headers:{Authorization:"Bearer "+token},data:data,success:function(res){form[target]=res,avalon.vmodels.root.currentRendered=!0},error:function(res){avalon.illyError("ajax error",res)},ajaxFail:function(res){avalon.illyError("ajax failed",res)}})}});return avalon.controller(function($ctrl){$ctrl.$onEnter=function(){form.visited=avalon.vmodels.root.currentIsVisited},$ctrl.$onRendered=function(){},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=form.js.map