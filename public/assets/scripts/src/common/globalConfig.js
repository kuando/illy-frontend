// ==================== global config area start, @included  ==================== //

    // project domain, by config 
    // @@include('../../../../config/illy_domain.cfg') @@ //
    // project images base src
    var illy_images_base_src = './assets/images';

    // global apiBaseUrl
    // @@include('../../../../config/illy_apiBaseUrl.cfg') @@ //
    
    // get the token and ready to cache
    var token = localStorage.getItem('illy-token');

    // global view loaded animation, from animation.css, the custom version 
    var global_viewload_animation_name = "a-bounceinR";

    // global config, always show loader when view enter 
    var global_always_show_loader = true;

    // global config, always reset scrollbar when view enter
    var global_always_reset_scrollbar = true;

    // global config, loading timeout
    var global_loading_timeout = 12000; // ms, abort the loading when timeout, then auto goback

    // global config, view loaded with a litle delay for rendering page, time enough
    var global_loading_delay = 300; // ms

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
