// ==================== app components area start @include ==================== // 

// loading component start //
root.$watch('currentAction', function(currentAction) {
    if (currentAction === 'onBegin') {
        loadingBeginHandler();
    }
    if (currentAction === 'onLoad') {
        loadingEndHandler();
    }
});
// loading component end //

// badNetworkHandler component start // 
root.$watch('currentAction', function(currentAction) {
    if (currentAction === 'onBegin') {
        bindBadNetworkHandler();
    }
    if (currentAction === 'onLoad') {
        unbindBadNetworkHandler();
    }
});
// badNetworkHandler component end //

// getCurrentState component start //
root.$watch('currentAction', function(currentAction) {
    if (currentAction === 'onLoad') {
        root.currentState = getCurrentState();
    }
});
// getCurrentState component end //

// setTitle component start //
root.$watch('currentAction', function(currentAction) {
    if (currentAction === 'onLoad') {
        setPageTitle();
    }
});
// setTitle component end //

// visitedChecker component start //
// 页面访问统计容器
var CACHE_VISITED_PAGEID_CONTAINER = [];
root.$watch('currentAction', function(currentAction) {
    if (currentAction === 'onBegin') {
        root.currentIsVisited = doIsVisitedCheck();
    }
});
// visitedChecker component end //

// resetScrollbar component start //
if (global_always_reset_scrollbar === true) {
    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onLoad') {
            resetScrollbarWhenViewLoaded();
        }
    });
}
// resetScrollbar component end //

// ==================== app components area end @include ==================== //