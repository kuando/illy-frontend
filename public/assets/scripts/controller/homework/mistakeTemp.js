define([], function() {
    
    // review in 201507221010

    var apiBaseUrl = ( avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl ) || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal && avalon.illyGlobal.token;

    // 题目要求视图,渲染题目信息面板
    var mistakeTemp = avalon.define({
        $id: "mistakeTemp",
        homeworkId: 0,
        // core!!! 因为mistake为抽象状态，无onEnter的params参数，故延迟到这里获取数据
        fetchDataForMistakeCtrl: function(id) { // 可以获取多种作业类型的数据了,201507201446
            var _id = id;   
            $http.ajax({
                url: apiBaseUrl + '/api/v1/homework/mistake/' + _id,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    mistakeTemp.goNext();
                    var mistake = avalon.vmodels.mistake;
                    mistake.exercises = res;
                },
                error: function(res) {
                    console.log('mistakeTemp ajax error' + res);
                },
                ajaxFail: function(res) {
                    console.log('mistakeTemp ajax failed' + res);
                }
            })
        },
        goNext: function(type) { // core!!! 判断跳转到哪种类型的题目
            avalon.router.go('app.mistake.wrong', {homeworkId: mistakeTemp.homeworkId, questionId: 1 });
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log("info.js onRendered fn");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            //avalon.log("info.js onEnter callback");
            var _id = params.homeworkId;
            mistakeTemp.homeworkId = params.homeworkId;
            mistakeTemp.fetchDataForMistakeCtrl(_id); // every time enter, do this
            if (avalon.vmodels.mistake.exercises.length != 0) {
                history.go(-1);
            }
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("info.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

