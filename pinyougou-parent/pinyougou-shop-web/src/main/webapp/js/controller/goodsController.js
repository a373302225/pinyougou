//商品控制层（商家后台）
app.controller('goodsController', function ($scope, $controller, $location,goodsService,
                                            uploadService, itemCatService, typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function () {
        var id = $location.search()['id']; //获取参数值、
        if (id==null){
            return;
        }
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                //向富文本编辑器里加入商品介绍
                editor.html($scope.entity.goodsDesc.introduction);
                //显示图片列表
                $scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
                //显示扩展属性
                $scope.entity.goodsDesc.customAttributeItems= JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //规格
                $scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);
                //SKU列表
                for (var i = 0; i < $scope.entity.itemList.length; i++) {
                    $scope.entity.itemList[i].spec=JSON.parse($scope.entity.itemList[i].spec);
                }
            }
        );
    }

    //保存
    $scope.save = function () {
        $scope.entity.goodsDesc.introduction = editor.html();	//将富文本编辑器的内容添加进去
        var serviceObject;//服务层对象
        if ($scope.entity.goods.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    alert(response.message);
                    $scope.entity = {};
                    editor.html("");	//清空富文本编辑器
                    location.href="goods.html"; //跳转到商品列表页面
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //上传图片
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(function (response) {
            if (response.success) {//如果上传成功，取出url
                $scope.image_entity.url = response.message;//设置文件地址
            } else {
                alert(response.message);
            }
        }).error(function () {
            alert("上传发生错误");
        });
    };

    //添加图片
    $scope.entity = {goods: {}, goodsDesc: {itemImages: [], specificationItems: []}};//定义页面实体结构
    //添加图片列表
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }


    //列表中移除图片
    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }


    //读取一级分类
    $scope.selectItemCatList = function () {
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemCatList = response;
            }
        );
    }

    //读取二级分类
    $scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCatList2 = response;
            }
        );
    });

    //读取三级分类
    $scope.$watch('entity.goods.category2Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCatList3 = response;
            }
        );
    });

    //读取模板id
    $scope.$watch('entity.goods.category3Id', function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function (response) {
                $scope.entity.goods.typeTemplateId = response.typeId;
            }
        )
    })

    //查询模板实体类，获取品牌列表，获取扩展属性text值
    $scope.$watch('entity.goods.typeTemplateId', function (newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function (response) {
                $scope.typeTemlate = response;    //获取类型模板
                $scope.typeTemlate.brandIds = JSON.parse($scope.typeTemlate.brandIds);  //获取品牌列表并类型转换
                //扩展属性
                //如果没有ID，则加载模板中的扩展数据
                if($location.search()['id']==null){
                    $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemlate.customAttributeItems);
                }
            }
        );

        //读取规格
        typeTemplateService.findSpecList(newValue).success(
            function (response) {
                $scope.specList = response;
            }
        );

    });

    //选中规格选项的状态（勾选或不勾选,并显示和保存）
    $scope.updateSpecAttribute = function ($event, text, optionName) {
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', text);
        if (object != null) {
            if ($event.target.checked) {
                object.attributeValue.push(optionName);
            } else {     //取消勾选
                object.attributeValue.splice(object.attributeValue.indexOf(optionName), 1) //移除选项
                //如果选项都取消了，将此条记录全部移除
                if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice(
                        $scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
                }
            }
        } else {
            $scope.entity.goodsDesc.specificationItems.push({"attributeName": text, "attributeValue": [optionName]});
        }
    }

    //创建SKU列表
    $scope.createItemList=function () {
        $scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0' }]; //初始化
        var items = $scope.entity.goodsDesc.specificationItems;
        for (var i = 0; i < items.length; i++) {
            $scope.entity.itemList=addColumn($scope.entity.itemList,items[i].attributeName,items[i].attributeValue);
        }
    }

    //添加值
    addColumn=function (list,columnName,columnValues) {
        var newList=[]; //新的集合
        for (var i = 0; i < list.length; i++) {
            var oldRow = list[i];
            /*alert(JSON.stringify(oldRow));*/
            for (var j = 0; j < columnValues.length; j++) {
                var newRow = JSON.parse(JSON.stringify(oldRow));
                newRow.spec[columnName]=columnValues[j];
                /*alert(JSON.stringify(newRow));*/
                newList.push(newRow);
            }
        }
        /*alert(JSON.stringify(newList));*/
        return newList;
    }


    //根据规格名称和选项名称返回是否被勾选
    $scope.checkedAttributeValue=function (specName,optionName) {
        var items = $scope.entity.goodsDesc.specificationItems;
        var object = $scope.searchObjectByKey(items,'attributeName',specName);
        if (object==null){
            return false;
        }
        if (object.attributeValue.indexOf(optionName)>=0){
            return true;
        }else {
            return false;
        }
    }
});	
