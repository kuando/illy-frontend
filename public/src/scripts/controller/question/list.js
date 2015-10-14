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

                // common data 
                var viewWidth = $(window).width();
                var wrapper = $('.J-list-wrapper');
                var maxMoveX = viewWidth / 4;
                var canMoveAreaX = viewWidth / 5; 

                // deal with touchstart, and get the startX data
                var startX;
                $(wrapper).on('touchstart', '.inner', function(e) {
                    startX = e.touches[0].pageX;
                });

                // deal with touchmove and get some important data
                var movemoveDelta;
                var moveX;
                var endX;
                var moveDirection;
                $(wrapper).on('touchmove', '.inner', function(e) {
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
                    $(this).css('-webkit-transform', 'translateX(' + moveX + 'px)');
                });

                // deal with touchend and get some important data
                var swipeLeftDone = false;
                var swipeRightDoneAniName = 'a-bounceinR';
                $(wrapper).on('touchend', '.inner', function(e) {
                    e.preventDefault();
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

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

