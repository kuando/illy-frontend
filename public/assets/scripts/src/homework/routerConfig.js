// ==================== router start @include ==================== //

    var _v = '?v=' + global_resource_version;

    // title Map， 映射各种状态的action-bar title
    var ACTIONBAR_TITLE_MAP = {
        'list': "作业列表",
        'info': '作业详情',
        'question': '题目详情',
        'result': '作业结果',
        'mistakeList': '错题列表',
        'wrong': '错题详情',
        'evaluation': '课堂表现'
    };

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("app", { // app.js这个控制器接管整个应用控制权
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上, 会立即绘制list这个view
        views: {
            "header@": {
                templateUrl: "assets/templates/homework/header.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/header.js" + _v
            },
            "": {
                templateUrl: "assets/templates/homework/app.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/app.js" + _v // 指定控制器地址
            }
        }
    })
    .state("app.list", { // 定义一个子状态
        url: "", // list the homework and can enter to do it
        views: {
            "": {
                templateUrl: "assets/templates/homework/list.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/list.js" + _v // 指定控制器地址
            }
        }
    })
    .state("app.detail", { // 用来作为做题模块的总ctrl，抽象状态,加载完资源后会立即绘制info
        //url: "", // a homework with info and result panel, ms-view to render question one by one
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/templates/homework/detail.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/detail.js" + _v // 指定控制器地址
            }
        }
    })
    .state("app.detail.info", { // 作业信息面板，带homeworkId, 用于跳转到相应题目视图
        url: "detail/{homeworkId}/info", // 
        views: {
            "": {
                templateUrl: "assets/templates/homework/info.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/info.js" + _v // 指定控制器地址
            }
        }
    })
    .state("app.detail.question", { // 作业，url较为复杂，某作业下的某题
        url: "detail/{homeworkId}/q/{questionId}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/templates/homework/question.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/question.js" + _v, // 指定控制器地址
                ignoreChange: function(changeType) {
                    return !!changeType;
                }
            }
        }
    })
    .state("app.detail.result", { // 某次作业的结果
        url: "detail/{homeworkId}/result", // 
        views: {
            "": {
                templateUrl: "assets/templates/homework/result.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/result.js" + _v // 指定控制器地址
            }
        }
    })
    .state("app.mistake", { // 用来作为错题ctrl，抽象状态,加载完资源后会立即绘制 mistakeList
        //url: "", // a homework with info and result panel, ms-view to render question one by one
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/templates/homework/mistake.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/mistake.js" + _v // 指定控制器地址
            }
        }
    })
    .state("app.mistake.mistakeList", { // mistake list
        url: "mistake/list", // 
        views: {
            "": {
                templateUrl: "assets/templates/homework/mistakeList.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/mistakeList.js" + _v, // 指定控制器地址
                viewCache: true
            }
        }
    })
    .state("app.mistake.wrong", { // mistake question
        url: "mistake/{homeworkId}/q/{questionId}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/templates/homework/wrong.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/wrong.js" + _v, // 指定控制器地址
                ignoreChange: function(changeType) {
                    return !!changeType;
                }
            }
        }
    })
    .state("app.evaluation", { // 课堂表现评价列表
        url: "evaluation", // 
        views: {
            "": {
                templateUrl: "assets/templates/homework/evaluation.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/evaluation.js" + _v // 指定控制器地址
            }
        }
    });

    // ==================== router end @include ==================== //
