app.controller("contentController",function ($scope,contentService) {

    $scope.contentList=[];   //广告列表
    //根据广告分类id查询广告列表
    $scope.findByCategoryId=function (categoryId) {
        contentService.findByCategoryId(categoryId).success(
            function (response) {
                // alert(response);
                $scope.contentList[categoryId]=response;
            }
        )
    }
})