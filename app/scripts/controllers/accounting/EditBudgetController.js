(function (module) {
    mifosX.controllers = _.extend(module, {
        EditBudgetController: function (scope, routeParams, resourceFactory, location) {
            
             resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed: true, usage: 1, disabled: false, type: 1}, function (data) {
                scope.assetGlAccounts = data;
            });

            resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed: true, usage: 1, disabled: false, type: 2}, function (data) {
                scope.liabilityGlAccounts = data;
            });


            resourceFactory.accountCoaResource.getAllAccountCoas({manualEntriesAllowed: true, usage: 1, disabled: false, type: 5}, function (data) {
                scope.expenseGlAccounts = data;
            });

            resourceFactory.budgetResource.get({budgetAccountId: routeParams.id, template: 'true'}, function (data) {
                scope.budgetdata = data;
                scope.budgetAccountId = data.id;
               
                scope.formData = {
                    name: data.name,
                    description: data.description,
                    fromDate: data.fromDate,
                    toDate: data.toDate,
                    createDate: data.createDate,
                    year: data.year,
                    disabled: data.disabled,
                    liabilityAccountId: data.liabilityAccountId,
                    assetAccountId: data.assetAccountId,
                    expenseAccountId: data.expenseAccountId,
                    amount: data.amount
                };
             //   scope.changeType() ;
            });

            scope.changeType = function () {
                if (scope.formData.type == 1) {
                    scope.types = scope.coadata.allowedAssetsTagOptions;
                    scope.headerTypes = scope.coadata.assetHeaderAccountOptions
                } else if (scope.formData.type == 2) {
                    scope.types = scope.coadata.allowedLiabilitiesTagOptions;
                    scope.headerTypes = scope.coadata.liabilityHeaderAccountOptions;
                } else if (scope.formData.type == 3) {
                    scope.types = scope.coadata.allowedEquityTagOptions;
                    scope.headerTypes = scope.coadata.equityHeaderAccountOptions;
                } else if (scope.formData.type == 4) {
                    scope.types = scope.coadata.allowedIncomeTagOptions;
                    scope.headerTypes = scope.coadata.incomeHeaderAccountOptions;
                } else if (scope.formData.type == 5) {
                    scope.types = scope.coadata.allowedExpensesTagOptions;
                    scope.headerTypes = scope.coadata.expenseHeaderAccountOptions;
                }
            } ;

            scope.submit = function () {
                resourceFactory.budgetResource.update({'budgetAccountId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewbudget/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditBudgetController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.AccEditGLAccountController]).run(function ($log) {
        $log.info("EditBudgetController initialized");
    });
}(mifosX.controllers || {}));
