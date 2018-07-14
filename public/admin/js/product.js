$(function() {
    var page = 1;
    var pageSize = 5;
    var imgs = [];
    render();
    //点击添加商品,显示模态框
    $('.btn_add').on('click', function() {
        $('#addModal').modal('show');
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function(info) {
                console.log(info);
                $('.dropdown-menu').html(template('tpl2', info))
            }
        });
    });
    //二级分类选择功能
    //给dropdown-menu下所有的a注册事件,(委托)
    $('.dropdown-menu').on('click', 'a', function() {
        $('.dropdown-text').text($(this).text());
        $("[name='brandId']").val($(this).data('id'));
        $('form').data('bootstrapValidator').updateStatus('brandId', 'VALID');

    });

    $('#fileupload').fileupload({
        done: function(e, data) {
            if (imgs.length == 3) {
                return;
            }
            //图片上传成功
            console.log(data.result);
            //把得到的结果放到数组中去
            imgs.push(data.result);
            $('.img_box').append('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">');
            console.log(imgs.length);
            if (imgs.length == 3) {
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')

            } else {
                $('form').data('bootstrapValidator').updateStatus('brandLogo', 'INVALID')
            }
        }
    });
    //表单校验
    $('form').bootstrapValidator({
        //配置小图标的规则
        feedbackIcons: {
            valid: 'glyphicon glyphicon-thumbs-up',
            invalid: 'glyphicon glyphicon-thumbs-down',
            validating: 'glyphicon glyphicon-refresh'
        },
        excluded: [],
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的描述'
                    }
                }
            },
            num: {
                validators: {
                    // 数量 大于0，  99999  1-5  [1-9]4位  1  111
                    notEmpty: {
                        message: '请输入商品的库存'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d{0,4}$/,
                        message: '请输入正确的库存(1-99999)'
                    }
                }
            },
            size: {
                validators: {
                    // 数量 大于0，  99999  1-5  [1-9]4位  1  111
                    notEmpty: {
                        message: '请输入商品的尺码'
                    },
                    //正则校验  xx-xx
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '请输入正确的尺码(xx-xx)'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品的价格'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传三种图片'
                    }
                }
            }
        }
    });
    //给表单校验成功注册事件
    $('form').on('success.form.bv', function(e) {
        e.preventDefault();
        var param = $('form').serialize();
        param += '&picName1=' + imgs[0].picName + '&picAddr1=' + imgs[0].picAddr;
        param += '&picName2=' + imgs[1].picName + '&picAddr2=' + imgs[1].picAddr;
        param += '&picName3=' + imgs[2].picName + '&picAddr3=' + imgs[2].picAddr;
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: param,
            success: function(info) {
                console.log(info);
                if (info.success) {
                    $('#addModal').modal('hide');
                    page = 1;
                    render();
                    $('form').data('bootstrapValidator').resetForm(true);
                    $('.dropdown-text').text('请选择二级分类');
                    $('.img_box img').remove();
                }
            }
        })
    })

    function render() {
        $.ajax({
            唐渝鹏: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: page,
                pageSize: pageSize,
            },
            success: function(info) {
                $('tbody').html(template('tpl', info));
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3, //必须指定
                    currentPage: page, //指定了当前页
                    totalPages: Math.ceil(info.total / info.size), //总页数

                    //控制每个按钮显示的文字,通过返回值来控制
                    //每个按钮都会执行一次itemText函数，返回值就是这个按钮的内容
                    itemTexts: function(type, page, current) {
                        //console.log(type, page, current);
                        switch (type) {
                            case "first":
                                return "第一页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "最后一页";
                            case "page":
                                return page + "页";
                        }
                    },
                    tooltipTitles: function(type, page, current) {
                        switch (type) {
                            case "first":
                                return "第一页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "最后一页";
                            case "page":
                                return page + "页";
                        }
                    },
                    useBootstrapTooltip: true,
                    bootstrapTooltipOptions: {
                        placement: "bottom"
                    },
                    onPageClicked: function(a, b, c, p) {
                        page = p;
                        render();
                    }
                })
            }
        })
    }


})