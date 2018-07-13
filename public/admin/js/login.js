$(function() {
    $('form').bootstrapValidator({
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 3,
                        max: 6,
                        message: '用户名长度必须为3-6位'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须为6-12位'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        },
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glypghicon glyphicon-refresh'
        }
    });
    $('form').on('success.form.bv', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $('form').serialize(),
            success: function(info) {
                if (info.error === 1000) {
                    //参数1：修改哪个字段
                    //参数2：修改状态  NOT-VALIDATED VALIDATING INVALID VALID
                    $("form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }

                if (info.error === 1001) {
                    $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }

                if (info.success) {
                    //登录成功
                    location.href = "index.html";
                }
            }
        })

    });
    //点击重置按钮需要调用bootstrapValidator提供的方法清楚清除内容和样式
    $("[type='reset']").on('click', function() {
        $('form').data('bootstrapValidator').resetForm(true);
    });



});