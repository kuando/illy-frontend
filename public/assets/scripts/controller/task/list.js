define([], function() {
    
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    if (!token) {
        alert("no token error");
        return;
    }

    // 每页大小
    var limit = 6;
    var taskList = avalon.define({ // 

        $id: "taskList",
        lists: [],
        visited: false,
        offset: 0,
        btnShowMore: true,
        fetchData: function(data, concat) {

            if (taskList.visited) { return ; }

            $http.ajax({
                method: "",
                url: apiBaseUrl + "/api/v1/tasks",
                data: data,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function(lists) {
                    concat ? taskList.lists.concat(lists) : taskList.lists = lists; // mark!!! concat work?
                },
                error: function(res) {
                    console.log("taskList list ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.log("taskList list ajax failed" + res);
                }
            })

        }, // end of fetchData
        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            if (taskList.offset < limit) {
                taskList.btnShowMore = false;
                return;
            } else {
                taskList.offset = taskList.offset + limit * (page - 1);
            }

            taskList.fetchRemoteData({offset: taskList.offset}, 'concat');
        },
        taskTypeMap: { // for future extension
            0: 'article',
            1: 'activity'
        },
        goSpecTask: function() {
            // get info from target you click and then do dispatch
            var taskType = arguments[0].getAttribute('data-taskType');
            var taskId = arguments[0].getAttribute('data-taskId');
            var taskScoreAward = arguments[0].getAttribute('data-taskScoreAward');
            var state = 'task.detail.' + taskList.taskTypeMap[taskType];
            avalon.router.go(state, {taskId: taskId, scoreAward: taskScoreAward});
        }

    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {

            taskList.visited = avalon.vmodels.root.currentIsVisited;
            taskList.offset <= limit ? taskList.btnShowMore = false : taskList.btnShowMore = true; // otherwise, show it
            taskList.fetchData();

        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

