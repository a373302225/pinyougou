app.controller("baseController",function ($scope) {

    //分页控件配置
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.reloadList();//重新加载

        }
    };
    //刷新列表
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage)
    }

    //获取需要删除的id
    $scope.selectIds = [];//用户勾选的id集合
    //用户勾选的时候调用
    $scope.updateSelection = function ($event, id) {
        if ($event.target.checked) {
            $scope.selectIds.push(id);//push向集合添加元素
        } else {
            var index = $scope.selectIds.indexOf(id);//查找值在集合中的位置
            $scope.selectIds.splice(index, 1);//参数1是移除的位置,参数2是移除的个数
        }
    }

    //提取 json 字符串数据中某个属性，返回拼接字符串 逗号分隔
    $scope.jsonToString=function (jsonString,key) {
        var json = JSON.parse(jsonString);  //将 json 字符串转换为 json 对象
        var value="";
        for (var i = 0; i < json.length; i++) {
            if (i>0){
                value +=",";
            }
            value += json[i][key];
        }
        return value;
    }

    //在list集合中根据某key值查询对象
    $scope.searchObjectByKey=function (list,key,keyValue) {
        for (var i = 0; i < list.length; i++) {
             if (list[i][key]==keyValue){
                 return list[i];
             }
        }
        return null;
    }

});