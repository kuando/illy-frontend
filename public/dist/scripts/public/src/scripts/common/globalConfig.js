// ==================== global config area start, @included  ==================== //

// screen splash show time config
//avalon.splashShowTime = 666; // ms, used in app.js

// project domain
var illy_domain = 'http://app.hizuoye.com';

// project images base src
var illy_images_base_src = illy_domain + '/assets/images';

// global apiBaseUrl
var api_base_url = 'http://101.201.176.191/api/v1/';

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

// ==================== global config area end, @included  ==================== //
