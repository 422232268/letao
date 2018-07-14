$(function() {
    var page = 1;
    var pageSize = 5;
    render();

    $('.btn_add').on('click', function() {

        $('#addModal').modal('show');
    });
    $('form').bootstrapValidator({
        fields: {
            categoryName: {
                notEmpty: {
                    message: '一级分类的名称不能为空'
                }
            }
        },
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glyphicon glyphicon-refresh'
        }
    });
    //给表单注册校验成功事件,阻止表单的默认提交,改用ajax提交
    $('form').on('success.form.bv', function(e) {

        e.preventDefault();
        console.log(123)
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('form').serialize(),
            success: function(info) {
                if (info.success) {
                    $('#addModal').modal('hide');
                    page = 1;
                    render();
                    $('form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    });

    function render() {
        //发送ajax请求;
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function(info) {
                console.log(info);
                $('tbody').html(template('tpl', info))
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function(a, b, c, p) {
                        page = p;
                        render();
                    }
                })
            }

        })
    }









})