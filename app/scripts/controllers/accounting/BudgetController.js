(function (module) {
    mifosX.controllers = _.extend(module, {
        BudgetController: function ($uibModal,routeParams,route,scope, resourceFactory, location, dateFilter) {

            scope.formData = {disabled: false,};
//            scope.formData.crAccounts = [{}];
//            scope.formData.dbAccounts = [{}];
            scope.first = {};
            scope.first.fromDate = new Date();
            scope.first.createDate = new Date();
            scope.first.year = scope.first.fromDate.getFullYear();
            scope.first.month = scope.first.fromDate.getMonth();
            scope.first.day = scope.first.fromDate.getDate();
            scope.first.toDate = new Date(scope.first.year + 1, scope.first.month, scope.first.day);
            scope.errorcreditevent = false;
            scope.errordebitevent = false;
            scope.budgettemplate = false;
//            scope.debitaccounttemplate = false;
            scope.restrictDate = new Date();
//            scope.showPaymentDetails = false;
            resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed: true, usage: 1, disabled: false, type: 1}, function (data) {
                scope.assetGlAccounts = data;
            });

            resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed: true, usage: 1, disabled: false, type: 2}, function (data) {
                scope.liabilityGlAccounts = data;
            });


            resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed: true, usage: 1, disabled: false, type: 5}, function (data) {
                scope.expenseGlAccounts = data;
            });

//            resourceFactory.paymentTypeResource.getAll( function (data) {
//                scope.paymentTypes = data;
//            });

//            resourceFactory.currencyConfigResource.get({fields: 'selectedCurrencyOptions'}, function (data) {
//                scope.currencyOptions = data.selectedCurrencyOptions;
//                scope.formData.currencyCode = scope.currencyOptions[0].code;
//            });

            scope.submit = function () {

                //var budget = new Object();
                var fromDate = dateFilter(scope.first.fromDate, scope.df);
                var toDate = dateFilter(scope.first.toDate, scope.df);
                var createDate = dateFilter(scope.first.createDate, scope.df);

                if (scope.first.fromDate) {
                    fromDate = dateFilter(scope.first.fromDate, scope.df);
                    scope.formData.fromDate = fromDate;
                }
//
                if (scope.first.toDate) {
                    toDate = dateFilter(scope.first.toDate, scope.df);
                    scope.formData.toDate = toDate;
                }
                if (scope.first.createDate) {
                    createDate = dateFilter(scope.first.createDate, scope.df);
                    scope.formData.createDate = createDate;
                }
//                 if (scope.first.year) {
//                   scope.formData.year = scope.first.year;
//                }
//
                scope.formData.locale = scope.optlang.code;
                scope.formData.dateFormat = scope.df;
////              budget.officeId = this.formData.officeId;
//                budget.fromDate = scope.formData.fromDate;
//                budget.toDate = scope.formData.toDate;
//                budget.createDate = scope.formData.createDate;
//                budget.year = scope.formData.year;
//                budget.disabled = scope.formData.disabled;
//                budget.description = scope.formData.description;
//                budget.name = scope.formData.name;
//                budget.liabilityAccountId = scope.formData.liabilityAccountId;
//                budget.assetAccountId =scope.formData.assetAccountId;
//                budget.expenseAccountId = scope.formData.expenseAccountId;
//                budget.amount = scope.fromData.amount;
//              
               
                resourceFactory.budgetResource.save(this.formData, function (data) {
                    location.path('/viewbudget/' + data.resourceId);
                });
            }
            
            
            scope.budgetdatas = [];
            scope.isTreeView = false;

            scope.routeTo = function (id) {
                location.path('/viewbudget/' + id);
            };

            if (!scope.searchCriteria.acoa) {
                scope.searchCriteria.acoa = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.acoa;

            scope.onFilter = function () {
                scope.searchCriteria.acoa = scope.filterText || '';
                scope.saveSC();
            };

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            scope.ChartsPerPage = 15;
            resourceFactory.budgetResource.getAllBudget(function (data) {
                scope.budgetdatas = scope.deepCopy(data);
                  //scope.budgetdatas = data;
                
    });
       
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
    mifosX.ng.application.controller('BudgetController', ['$uibModal','$routeParams','$route','$scope', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.BudgetController]).run(function ($log) {
        $log.info("BudgetController initialized");
    });
}(mifosX.controllers || {}));