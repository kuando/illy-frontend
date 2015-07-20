define([], function() {

    // review in 201507201010

	// 本次作业结果反馈页面
    var result = avalon.define({
		$id: "result",
		rightAward: 0,
		finishedAward: 0,
		totalAward: 0,
		rightCount: 0,
		wrongCount: 0,
		totalScore: 0
	});

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
			//avalon.log("result.js onRendered fn");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
			//avalon.log("result.js onEnter callback");
			//avalon.log(params); 
			var source = avalon.getPureModel('detail').result;
			result.rightAward = source.rightAward;
			result.finishedAward = source.finishedAward;
			result.totalAward = source.totalAward;
			result.rightCount = source.rightCount;
			result.wrongCount = source.wrongCount;
			result.totalScore = source.totalScore;
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
			//avalon.log("result.js onBeforeUnload fn");
		}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

