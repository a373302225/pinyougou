//控制层
app.controller("brandController", function ($scope, $controller ,brandService) {

    $controller("baseController",{$scope:$scope});  //继承

    // 查询品牌列表
    $scope.findAll = function () {
        brandService.findAll().success(
            function (response) {
                $scope.list = response;
                // alert(data);
            }
        )
    }


    //分页
    $scope.findPage = function (page, rows) {
        brandService.findPage(page,rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;
            }
        );
    }

    //保存
    $scope.save = function () {
        var object = null;
        if ($scope.entity.id != null) {
            object=brandService.update($scope.entity);
        }else {
            object=brandService.add($scope.entity);
        }
        object.success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//成功就刷新
                } else {
                    alert(response.message);
                }
            }
        );
    }

    //查询品牌
    $scope.findOne = function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }


    //删除
    $scope.dele = function () {
        brandService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();
                } else {
                    alert(data.message);
                }
            });
    }

    $scope.searchEntity = {};
    //条件查询
    $scope.search = function (page, rows) {
        brandService.search(page,rows,$scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;

            }
        );
    }
});
