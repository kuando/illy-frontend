// ==================== global config area start, @included  ==================== //

    // project domain
    //var illy_domain = 'http://weixin.hizuoye.com';
    var illy_domain = 'http://weixin.hizuoye.com';

    // project images base src
    var illy_images_base_src = illy_domain + '/assets/images';

    // global apiBaseUrl
    var api_base_url = 'http://api.hizuoye.com/api/v1/';

    // get the token and ready to cache
    var token = localStorage.getItem('illy-token');

    // global view loaded animation, from animation.css, the custom version 
    var global_viewload_animation_name = "a-bounceinR";

    // global config, always show loader when view enter 
    var global_always_show_loader = true;

    // global config, always reset scrollbar when view enter
    var global_always_reset_scrollbar = true;

    // global config, loading timeout
    var global_loading_timeout = 8000; // ms, abort the loading when timeout, then auto goback

    // global config, view loaded with a litle delay for rendering page, time enough
    var global_loading_delay = 300; // ms

    // global config, loader className
    var global_loader_className = '.loader';

    // global config, loader'dom, must ensure the dom is exists
    var global_loader_dom = document.querySelector('.loader');

    // global config, error log style
    var global_errorLog_style = "background-color: red; color: #fff; padding: 3px; border-radius: 3px";

    // global config, info log style
    var global_infoLog_style = "background-color: #fff; color: #14E5D5; padding: 3px; border-radius: 3px";

    // ==================== global config area end, @included  ==================== //