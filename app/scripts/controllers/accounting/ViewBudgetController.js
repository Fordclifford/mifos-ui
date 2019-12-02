(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewBudgetController: function (scope, routeParams, $rootScope, translate, resourceFactory, route, location, $uibModal) {

        
            resourceFactory.budgetResource.get({budgetAccountId: routeParams.id, template: 'true'}, function (data) {


                scope.bdata = data;
                console.log(data)
            });

            scope.deleteGBudget = function () {
                $uibModal.open({
                    templateUrl: 'deletebudget.html',
                    controller: GlAccDeleteCtrl
                });
            };
            var GlAccDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.budgetResource.delete({budgetAccountId: routeParams.id}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/budget');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.changeState = function (disabled) {
                resourceFactory.budgetResource.update({'budgetAccountId': routeParams.id}, {disabled: !disabled}, function (data) {
                    route.reload();
                });
            };

        }
    });
    mifosX.ng.application.controller('ViewBudgetController', ['$scope', '$routeParams', '$rootScope', '$translate', 'ResourceFactory', '$route', '$location', '$uibModal', mifosX.controllers.AccCoaController]).run(function ($log) {
        $log.info("ViewBudgetController initialized");
    });
}(mifosX.controllers || {}));
