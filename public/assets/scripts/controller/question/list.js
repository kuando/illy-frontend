define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;
    
    var localLimit = 6; // 一次抓取多少数据
    var list = avalon.define({

        $id: "list",
        isVisited: false,
        noContent: false,
        noContentText: '还没有做过作业哦，<br/>快去完成作业，得到老师评价吧~',

        lists: [],

        isLoading: false, // 正在加载标记
        offset: 0, // inner var, to fetch data with offset and limit
        noMoreData: false, // no more data
        btnShowMore: false,
        fetchData: function(data, concat) {
            list.isLoading = true;

            var limit = localLimit;
            var offset;
            offset = list.lists.length || 0;

            $http.ajax({
                url: apiBaseUrl + "questions?state=0&limit=" + limit + "&offset=" + offset,
                data: data,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(lists) {

                    if (concat === true) {
                        list.lists = list.lists.concat(lists);
                    } else {
                        list.lists = lists;
                    }
                    setTimeout(function() {                          
                        var newLists = list.lists;
                        if (newLists && newLists.length === 0) {
                            list.noContent = true;
                        }      
                    }, 200);
                    if (lists.length === 0) {
                        list.noMoreData = true;
                    }
                    list.isLoading = false;
                },
                error: function(res) {
                    avalon.illyError("list ajax error", res);
                    if (list.lists.length <= 1) {
                        list.noContent = true;
                    }
                },
                ajaxFail: function(res) {
                    avalon.illyError("list ajax failed" + res);
                    if (list.lists.length <= 1) {
                        list.noContent = true;
                    }
                }
            });
        }, // end of fetchData
        showMore: function(e) {
            e.preventDefault();
            list.fetchData({}, true); //is concat 
        },
        deleteQuestion: function(questionId) {
            $http.ajax({
                method: 'DELETE',
                url: apiBaseUrl + "questions/" + questionId,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function() {
                    list.lists.forEach(function(item, i) {
                        if (item._id === questionId) {
                            list.lists.splice(i, 1);
                        }
                    })
                },
                error: function(res) {
                    avalon.illyError("question delete ajax error", res);
                },
                ajaxFail: function(res) {
                    avalon.illyError("question delete ajax failed" + res);
                }
            });
        }

    }); // end of define

    list.lists.$watch('length', function(newLength) { // mark for avalon1.5+ change this way
        if (newLength && (newLength < localLimit)) {
            list.btnShowMore = false;
        } else {
            list.btnShowMore = true;
        }
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function() {

            avalon.vmodels.result.current = 'list';
            list.isVisited = avalon.vmodels.root.currentIsVisited;
            if (!list.isVisited) {
                list.fetchData();
            }

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

            (function() {

                var throttle = function(func, wait, options) {
                    var context, args, result;
                    var timeout = null;
                    // 上次执行时间点
                    var previous = 0;
                    if (!options) { options = {}; }
                    // 延迟执行函数
                    var later = function() {
                        // 若设定了开始边界不执行选项，上次执行时间始终为0
                        previous = options.leading === false ? 0 : Date.now();
                        timeout = null;
                        result = func.apply(context, args);
                        if (!timeout) { context = args = null; }
                    };
                    return function() {
                        var now = Date.now();
                        // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
                        if (!previous && options.leading === false) { previous = now; }
                        // 延迟执行时间间隔
                        var remaining = wait - (now - previous);
                        context = this;
                        args = arguments;
                        // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
                        // remaining大于时间窗口wait，表示客户端系统时间被调整过
                        if (remaining <= 0 || remaining > wait) {
                            clearTimeout(timeout);
                            timeout = null;
                            previous = now;
                            result = func.apply(context, args);
                            if (!timeout) { context = args = null; }
                            //如果延迟执行不存在，且没有设定结尾边界不执行选项
                        } else if (!timeout && options.trailing !== false) {
                            timeout = setTimeout(later, remaining);
                        }
                        return result;
                    };
                };

                // common data 
                var viewWidth = $(window).width();
                var wrapper = '.J-list-wrapper';
                var touchTarget = '.ui-layer';
                var maxMoveX = viewWidth / 4;
                var canMoveAreaX = viewWidth / 5; 

                // deal with touchstart, and get the startX data
                var startX;
                $(wrapper).on('touchstart', touchTarget, function(e) {
                    startX = e.touches[0].pageX;
                });

                // deal with touchmove and get some important data
                var moveDelta;
                var moveX;
                var endX;
                var moveDirection;
                $(wrapper).on('touchmove', touchTarget, function(e) {

                    var self = $(this);
                    var pageX = e.touches[0].pageX;
                    endX = pageX;
                    moveDelta = pageX - startX;
                    if (moveDelta < 0) {
                        moveDirection = 'left';
                    } else {
                        moveDirection = 'right';
                    }
                    if (startX < canMoveAreaX) {
                        e.preventDefault();
                        return;
                    }
                    if (swipeLeftDone === false && moveDirection === 'right') {
                        e.preventDefault();
                        return;
                    }
                    if (swipeLeftDone === true && moveDirection === 'left') {
                        e.preventDefault();
                        return;
                    }
                    //var offset = self.offset().left + (viewWidth - self.offset().width);
                    if (moveDelta < 0 && moveDelta < maxMoveX) {
                        moveX = moveDelta;
                    } else if (moveDelta < 0 && moveDelta >= maxMoveX) {
                        moveX = maxMoveX;
                    }
                    throttle(function move() {
                        self.css('-webkit-transform', 'translateX(' + moveX + 'px)');
                    }, 16);

                });

                // deal with touchend and get some important data
                var swipeLeftDone = false;
                //var swipeRightDoneAniName = 'a-bounceinR';
                $(wrapper).on('touchend', touchTarget, function() {
                    // e.preventDefault();
                    if (endX > 0 && endX < startX) { // if swipeLeft
                        $(this).css('-webkit-transform', 'translateX('+ -maxMoveX +'px)');
                        swipeLeftDone = true;
                        // add swipeLeft ani
                    } else if (endX > 0 && endX > startX && moveDelta > 40) { // swipeRight

                        // add swipeRight ani
                        //$(this).addClass(swipeRightDoneAniName);
                        //setTimeout(function() {
                            //$(this).removeClass(swipeRightDoneAniName);
                        //}.bind(this), 500);
                        
                        $(this).css('-webkit-transform', 'translateX(0px)');
                        swipeLeftDone = false;
                    } else {
                        if (swipeLeftDone === false){
                            $(this).click();
                        }
                    }
                });

            })();

            $('.J-list-wrapper').on('click', '.fn-layer', function() {
                var questionId = $(this).attr('data-questionId');
                list.deleteQuestion(questionId);
                $(this).hide();
            });

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

