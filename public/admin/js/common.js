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
    NProgress.start();
});

$(document).ajaxStop(function() {
    setTimeout(() => {
        NProgress.done();
    }, 500);
});
//二级菜单显示与隐藏的效果
$('.second').prev().on('click', function() {
    $(this).next().slideToggle();

});

$('.icon_menu').on('click', function() {
    $(".lt_aside").toggleClass("active");
    $("body").toggleClass("active");
});

$('.icon_logout').on('click', function() {
    $('#logoutModal').modal('show');
});


$('.btn_logout').on('click', function() {
    $.ajax({
        type: 'get',
        url: '/employee/employeeLogout',
        success: function(info) {
            if (info.success) {
                location.href = 'login.html';
            }
        }
    })
})