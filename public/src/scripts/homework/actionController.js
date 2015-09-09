// ==================== app actionController start @include ==================== //
root.$watch('currentAction', function(currentAction) {
    if (currentAction !== void 0) {
        
        switch (currentAction) {

            // -------------------- onError start -------------------- //
            case 'onError':
                avalon.log("Error!, Redirect to index!", arguments);
                avalon.router.go("app.list");
                break;
            // -------------------- onError end -------------------- //
             


           
            // -------------------- onBegin start -------------------- //
            case 'onBegin':

                // ====== view visit statistical ====== //          
                // ;avalon.vmodels.root.currentIsVisited = doIsVisitedCheck();
                // ====== view visit statistical ====== // 

                // ====== loader show and bind network handler ====== //         
                // ;;loadingBeginHandler(bindBadNetworkHandler);
                // ====== loader show and bind network handler ====== //
                
                break;
            // -------------------- onBegin end -------------------- //




            // -------------------- onLoad start -------------------- //
            case 'onLoad':

                // ====== reset scroll bar ====== //
                // ;;if (global_always_reset_scrollbar) {
                // ;;    resetScrollbarWhenViewLoaded();
                // ;;}
                // ====== reset scroll bar ====== //

                // update current state ====== //          
                // ;;root.currentState = getCurrentState();
                // state2 === void 0 ? root.currentState = state1 : root.currentState = state2; /* jshint ignore:line */
                // update current state ====== //

                // ====== set action bar title in page ====== //          
                // ;;setPageTitle();
                // ====== set action bar title in page ====== //

                // ====== remove loader and unbind bad network handler ====== //
                // next view loaded, remove loader && badNetworkHandler          
                // ;; loadingEndHandler(unbindBadNetworkHandler);
                // ====== remove loader and unbind bad network handler ====== //

                // ====== add view enter animation ====== //
                // var view = document.querySelector('[avalonctrl='+ root.currentState + ']');
                // for strong
                // view && view.classList.add(avalon.illyGlobal && avalon.illyGlobal.viewani); /* jshint ignore:line */
                // ====== add view enter animation ====== //

                break;
            // -------------------- onLoad end -------------------- //




            // -------------------- onBeforeUnload end -------------------- //
            case 'onBeforeUnload':
                break;
            // -------------------- onBeforeUnload end -------------------- //




            // -------------------- onUnload start -------------------- //
            case 'onUnload':
                break;
            // -------------------- onUnload end -------------------- //
            

        } // end of root.currentAction switch

    } // end of if
}); // end of root.currentAction watcher
// ==================== app actionController start @include ==================== //
