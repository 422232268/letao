$(function() {
    var page = 1;
    var pageSize = 5;
    render();
    $('.btn_add').on('click', function() {
        $('#addModal').modal('show');
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100,
            },
            success: function(info) {
                $('.dropdown-menu').html(template('tpl2', info));
            }
        })
    });
    $('.dropdown-menu').on('click', 'a', function() {
        $('.dropdown-text').text($(this).text());
        var id = $(this).data('id');
        $("[name='categoryId']").val(id);
        $('form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
    });
    $('#fileupload').fileupload({
            done: function(e, data) {
                $('.img_box img').attr('src', data.result.picAddr);
                $("[name='brandLogo']").val(data.result.picAddr);
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');

            }
        })
        //表单验证
    $('form').bootstrapValidator({
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '二级分类的名字不能为空'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传一张品牌的图片'
                    }
                }
            }

        },
        //配置不做校验的类型
        excluded: [],
        //配置小图标的规则
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glyphicon glyphicon-refresh'
        }
    });
    //给表单注册校验成功的时候
    $('form').on('success.form.bv', function(e) {
        e.preventDefault();
        console.log(123)
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('form').serialize(),
            success: function(info) {
                console.log(info)
                if (info.success) {

                    $('#addModal').modal('hide');
                    page = 1;
                    render();
                    $('form').data('bootstrapValidator').resetForm(true);
                    $('dropdown-text').text('请选择一级分类');
                    $('img_box img').attr('src', 'iamge/none.png');
                }
            }
        });
    });

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function(info) {
                console.log(info)
                $('tbody').html(template('tpl', info));
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPage: Math.ceil(info.total / info.size),
                    onPageClicked: function(a, b, c, p) {
                        page = p;
                        render();

                    }
                })
            }
        })
    }
})