// ==================== global config area start, @included  ==================== //

    // version 
    var global_resource_version = '0.0.4'; 

    // $http log off
    // $http.debug = true;
    
    // $http全局ajax request拦截器配置
    $http.requestInterceptor = function(oldSettings, xhr) {
        // 重置数据获取成功标记
        avalon.vmodels.root.currentDataDone = false;
        var global_headers = {
            'Authorization': 'Bearer ' + token
        };
        var newHeaders = avalon.mix(oldSettings.headers, global_headers);
        oldSettings.headers = newHeaders;

        return oldSettings;
    };
    
    // $http全局ajax resolve拦截器配置
    $http.resolveInterceptor = function() {
        // 数据获取成功
        avalon.vmodels.root.currentDataDone = true;

        // repaint the big image of the page, for better user experience
        if (!root.currentIsVisited) {
            var bigImage = document.querySelector('.big-image');
            if (bigImage) {
                bigImage.style.visibility = 'hidden';
                setTimeout(function() {
                    bigImage.style.visibility = 'visible';
                }, global_rendered_bigImage_delay || 300);
            }
        }
    };

    // $http全局ajax reject拦截器配置
    $http.rejectInterceptor = function(msg) {
        // 请求失败，去除最后一条页面记录，以便下次继续发起请求
        CACHE_VISITED_PAGEID_CONTAINER.pop();

        if (msg.indexOf('Authorization') >= 0) {
            alert('对不起，您没有Authorization，本系统仅供会员使用！');
        }
    };

    // project domain, by config 
    // @@include('../../../../config/illy_domain.cfg') @@ //
    // project images base src
    var illy_images_base_src = './assets/images';

    // resource base url
    var illy_resource_base_url = 'http://7rfll3.com1.z0.glb.clouddn.com/';

    // global apiBaseUrl
    // @@include('../../../../config/illy_apiBaseUrl.cfg') @@ //
    // get the token and ready to cache
    var token = localStorage.getItem('illy-token');

    // global view loaded animation, from animation.css, the custom version 
    var global_viewload_animation_name = "a-bounceinR";

    // global config, always show loader when view enter 
    var global_always_show_loader = false;

    // global config, always reset scrollbar when view enter
    var global_always_reset_scrollbar = true;

    // global config, loading timeout
    var global_loading_timeout = 12000; // ms, abort the loading when timeout, then auto goback

    // global config, view loaded with a litle delay for avalon rendering page, time enough
    // var global_loading_delay = 30; // ms
    var global_rendered_time = 88; // ms

    // page is reused so some old page big image will
    // splash in new page, add a delay to better UE. 201511031600
    var global_rendered_bigImage_delay = 300;

    // global config, loader className
    var global_loader_className = '.loader';

    // global config, loader'dom, must ensure the dom is exists
    var global_loader_dom = document.querySelector('.loader');

    // global config, error log style
    var global_errorLog_style = "background-color: red; color: #fff; padding: 3px; border-radius: 3px";
    // global config, error log style
    
    var global_warningLog_style = "background-color: #ff9100; color: #fff; padding: 3px; border-radius: 3px";

    // global config, info log style
    var global_infoLog_style = "background-color: #14e5d5; color: #fff; padding: 3px; border-radius: 3px";

    // global config, record log style
    var global_recordLog_style = "background-color: #64c400; color: #fff; padding: 3px; border-radius: 3px";

    // ==================== global config area end, @included  ==================== //
