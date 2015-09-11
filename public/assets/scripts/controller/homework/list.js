define([], function() {
    
    //var limit = 9; // 一次抓取多少数据

    // get config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl;
    
    // get config, token
    var token = avalon.illyGlobal.token; 
    if (token === null) {
        avalon.illyGlobal.noTokenHandler();
    }

    var list = avalon.define({

        $id: "list",
        noHomeworkContent: false,
        noContentText: '恭喜你小学霸，完成了所有作业，更多精彩，敬请期待!',
        showLoader: true, // only show loader in the first time
        homework: [], // 作业数据
        previews: [], // 预习数据
        offset: 0, // inner var, to fetch data with offset and limit
        //isLoading: false, // 正在加载标记
        fetchData: function(type) {
            //list.isLoading = true; // 正在加载标记
            $http.ajax({
                method: "",
                //url: "api/list.json?limit=6",
                url: apiBaseUrl + type,
                data: {
                    //offset: list.offset
                    //limit: 6
                },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(lists) {
                    list[type] = lists; //key ! fetch data
                    setTimeout(function() {                          
                        var newLists = list.homework;
                        if (newLists && newLists.length === 0) {
                            if (newLists.length === 0) {
                                list.noHomeworkContent = true;
                            }
                        }      
                    }, 200);
                },
                error: function(res) {
                    avalon.illyError('ajax error', res);
                    var newLists = list.homework;
                    if (newLists.length === 0) {
                        list.noHomeworkContent = true;
                    }
                },
                ajaxFail: function(res) {
                    avalon.illyError('ajax failed', res);
                    var newLists = list.homework;
                    if (newLists.length === 0) {
                        list.noHomeworkContent = true;
                    }
                }
            });
        } // end of fetchData

    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function() {

            // only show loader in the first time, add in 201508282113
            if (list.showLoader) {
                setTimeout(function() {
                    list.showLoader = false;
                }, 500);
            }
            if (!list.showLoader) {
                var loader = document.querySelector('.loader');
                loader && (loader.style.display = 'none'); /* jshint ignore:line */
            }
            
            // remove cache in detail ctrl
            list.fetchData('homework');

            if (avalon.vmodels.question !== void 0) { // fix in 20150811
                // 可以开启做题时间统计的标记, 自己第一次进入是true，同时唯一在此处开启
                avalon.vmodels.question.starter = true;
            }

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

