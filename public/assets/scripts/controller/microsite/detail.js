define([], function() {

    var detail = avalon.define({
		$id: "detail",
        title: "",
        content: "",
		created: "2015-07-09",
		shareCount: 88,
		visitCount: 88
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            var articleId = params.articleId !== "" ? params.articleId : 0
            return $http.ajax({
                url: "api/detail.json",
                //data: {
                //    action: "detail",
                //    articleId: articleId
                //},
                dataType: "json",
                success: function(json) {
                    detail.title = json.title;
                    detail.articleId = json.articleId;
                    detail.content = json.content;
                }
            })
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

		}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

