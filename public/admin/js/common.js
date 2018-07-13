/**
ajax有6个全局事件
ajaxStart();
ajaxSend();
ajaxSuccess();
ajaxError();
ajaxComplete();
ajaxStop();

 */
$(document).ajaxStart(function() {
    NProgress.star();
});
$(document).ajaxStop(function() {
    setTimeout(() => {
        NProgress.done();
    }, 500);
});