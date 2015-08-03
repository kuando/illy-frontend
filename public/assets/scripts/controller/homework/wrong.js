define([], function() {

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl;

    var token = avalon.illyGlobal && avalon.illyGlobal.token;
    
    // 每一个具体的题目控制器
    var wrong = avalon.define({
        $id: "wrong",
        homeworkId: '', // 直接取，这种固定值不需要动态获取
        exercises: [], // 所有题目数据
        exercise: {}, // 当前题所有数据
        total: 0, // 直接取不行,fuck bug... waste much time... 201507222006
        currentId: 0, // current exerciseId, 当前题id
        userAnswer: '', // 忠实于用户答案, 最多加个trim()
        localAnswers: [], // 本地保存本次作业当前所有做过的题的答案，length就是做到过哪一题了, core!!!
        right: null, // 做对与否, 当然是错的
        hasNext: false, // 是否有下一题？
        next: function() { // 点击进入下一题
            // 只处理页面跳转进入下一题. 待定！！！   mark!!!
            avalon.router.go('app.wrong', {homeworkId: wrong.homeworkId, questionId: wrong.currentId + 1});
        },
        submit: function() {

            /** 
             *  提交具体逻辑待定 
             */

            avalon.router.go('app.mistake');

        } 
    });


    return avalon.controller(function($ctrl) {

        // 仅执行一次，根据api获取当前作业下所有错题数据
        wrong.exercises = [];

        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图, 对复用的数据进行重置或清空操作！
        // 一个重大的问题或者注意事项就是，恢复的顺序问题，很多数据都是有顺序依赖的
        $ctrl.$onEnter = function(params) {

            wrong.currentId = params.questionId;
            wrong.homeworkId = params.homeworkId;

            $http.ajax({
                url: apiBaseUrl + '/api/v1/homework/mistake/' + wrong.homeworkId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    wrong.exercises = res;

                    // 然后双向绑定，渲染
                    var id = params.questionId - 1 || 0; // for strong, url中的questionId才用的是1开始，为了易读性
                    wrong.exercise = wrong.exercises[id]; // yes


                    wrong.localAnswers.push(wrong.exercise.wrongAnswer);

                    // core! 双向绑定的同时还能恢复状态！ dom操作绝迹！ 20150730
                    wrong.userAnswer = wrong.localAnswers[wrong.currentId - 1] || '';

                    //question.homeworkId = params.homeworkId !== "" ? params.homeworkId : 0; // yes, 直接从父vm属性中拿,这个不变的东西，不需要在此处动态获取！

                    // 重置题目对错标记
                    wrong.right = (wrong.exercise.answer == wrong.userAnswer);

                    wrong.total = avalon.vmodels.wrong.exercises.length; // yes, must动态设置
                    if (params.questionId < wrong.total) { // key! to next or submit
                        wrong.hasNext = true;
                    } else {
                        wrong.hasNext = false;
                    }

                },
                error: function(res) {
                    console.log('wrong ajax error!');
                    alert("出错啦！请稍后重试~");
                    avalon.router.go('app.mistake');
                },
                ajaxFail: function(res) {
                    console.log('wrong ajax fail!');
                    alert("出错啦！请稍后重试~");
                    avalon.router.go('app.mistake');
                }
            })

            
        } // onEnter end
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("question.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

