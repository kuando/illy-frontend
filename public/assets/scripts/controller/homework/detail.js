define([], function() {

    // review in 201507221009 
    
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';

    // 作业详情控制器
    var detail = avalon.define({

        $id: "detail",
        homeworkId: 1, // 作业id，用于发送给server的第一个参数
        title: 'detail.js title', // 作业标题，用于info面板
        keyPoint: 'detail.js keyPoint', // 知识重点，用于info面板
        keyPointRecord: 'detail.js keyPointRecord', // 知识重点录音
        exercises: [], // 题目列表
        questionStartTime: '', // 做题开始时间
        wrongCollect: [], // 发送给server的第二个参数，收集错题的列表
        audioAnswers: [], // 发送给server的第三个参数，录音题列表
        result: { // 结果面板数据集, fake data
            rightAward: 88,
            finishedAward: 88,
            totalAward: 888,
            rightCount: 15,
            wrongCount: 0,
            totalScore: 100
        },
        submit: function() { // core!!!
            //avalon.log("detail submit"); // no log, but real here, don't worry
            
            // 统计做题时间
            var spendSeconds = ( Date.now() - avalon.vmodels.detail.questionStartTime ) / 1000;
            var IntSpendSeconds = parseInt(spendSeconds, 10) || 0;

            var type = avalon.vmodels.info.workType;
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + '/api/v1/'+ type +'/' + detail.homeworkId + '/performance',
                headers: {
                    Authorization: 'Bearer ' + avalon.illyGlobal.token
                },
                data: {
                    _id: avalon.getPureModel('detail').homeworkId,
                    spendSeconds: IntSpendSeconds,
                    wrongCollect: avalon.getPureModel('detail').wrongCollect,
                    audioAnswers: avalon.getPureModel('detail').audioAnswers,
                    numOfExercise: avalon.getPureModel('detail').exercises.length
                },
                success: function(res) {
                    var target = avalon.vmodels.detail.$model.result;
                    target.rightAward = res.rightAward,
                    target.finishAward = res.finishAward,
                    target.totalAward = res.totalAward,
                    target.rightCount = res.rightCount,
                    target.wrongCount = res.wrongCount,
                    target.totalScore = res.totalScore
                    setTimeout(function() {
                        // go result
                        avalon.router.go('app.detail.result', {homeworkId: detail.homeworkId});
                    }, 16)
                },
                error: function(res) {
                    console.log(res);
                    alert("系统错误, 请稍后再试!");
                    avalon.router.go('app.list'); // go list page
                }
            })
        }, // end of submit
        clearCachedData: function() { // 清除缓存数据
            // 清除detail控制器缓存的统计数据
            var detailVM = avalon.getPureModel('detail');
            detailVM && (detailVM.wrongCollect = []);
            detailVM && (detailVM.audioAnswers = []);
            // 清除题目页面缓存的统计数据
            var questionVM = avalon.getVM('question'); // bug!!! $model不统一于vm本身
            questionVM && (questionVM.localAnswers = []);
            avalon.log(avalon.vmodels.question && avalon.vmodels.question.localAnswers);
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            // 抽象视图，啥也不做,放到具体视图里做,但会执行
            detail.clearCachedData(); // 对付后退又进入，最多后退到info页面(还在detail控制范围内)还保存数据
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            // tip user whether drop current done! todo!
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

