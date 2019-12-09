var loans = angular.module('appModule');

loans.config(function ($routeProvider, $httpProvider, $locationProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $locationProvider.hashPrefix('');


});

loans.controller('LoansController', function ($rootScope, $scope, $timeout, appService, $routeParams, localStorageService, HttpRequest) {

    $scope.Transactions = {};

    /****
     * get customer list
     * */

    $scope.Transactions.transactions = {
        data: [],
        updateInfo: {},
        currentPage: 1,
        totalItems: 0,
        page: 1,
        totalPages: 0,
        startPosition: 0,
        endPosition: 0,
        showNextButton: false,
        showPrevButton: false,
        search: '',
        goToPrevPage: function () {

            if (this.totalPages > 1 && this.page >= 1) {
                if (this.page > 0) {
                    this.page = Math.abs(this.page) - 1;
                    $scope.Transactions.getAllLoans()
                }
            }
            if (this.page == 1) {
                this.showPrevButton = false;
            }
        },
        goToNextPage: function () {

            if (this.totalPages > 1) {
                if (this.page <= this.totalPages) {
                    this.page = Math.abs(this.page) + 1;
                    $scope.Transactions.getAllLoans()
                }
                if (this.totalPages == this.page) {
                    this.showNextButton = false;
                }
                this.showPrevButton = true;
            }
        },
        noInfoFound: function () {
            this.data = [];

        },
        searchRecords: function () {

            this.data = [];
            this.currentPage = 1;
            this.totalItems = 0;
            this.page = 1;
            this.totalPages = 0;
            this.startPosition = 0;
            this.endPosition = 0;
            this.showNextButton = false;
            this.showPrevButton = false;
            $scope.Transactions.getAllLoans();

        },
        startAndEnd: function () {

            if (this.page > 1) {
                this.startPosition = ((this.page - 1) * ITEMS_PER_PAGE) + 1;
                this.endPosition = Math.abs(this.startPosition) + this.data.length - 1;
                return;
            }
            this.startPosition = this.page == 1 ? 1 : this.page * ITEMS_PER_PAGE;
            this.endPosition = Math.abs(this.startPosition) + this.data.length;
            if (this.endPosition > 1) {
                this.endPosition--;
            }

            if (this.totalItems == 0) {
                this.startPosition = 0;
                this.endPosition = 0;
            }
        },
        initialLoad: function (res) {
            this.data = res.data;

            this.startPosition = res.totalRecord == 0 ? 0 : 1;

            this.totalItems = res.totalRecord.totalItems;
            this.totalPages = Math.ceil(res.totalRecord.totalItems / ITEMS_PER_PAGE);

            if (res.totalRecord < ITEMS_PER_PAGE) {
                this.showNextButton = false;
                this.showPrevButton = false;
            } else {
                this.showNextButton = true;
            }

            if (this.totalPages == this.page) {
                this.showNextButton = false;
            }

            if (this.page > 1) {
                this.showPrevButton = true;
            }
            this.startAndEnd();

        }
    };


    $scope.Transactions.filterBy = 0;
    $scope.Transactions.filterInvites = 0;

    $scope.Transactions.filterByActions = function (type) {
        $scope.Transactions.filterBy = type;
        $scope.Transactions.transactions.page = 1;
        $scope.Transactions.transactions.searchRecords();
    };

    $scope.Transactions.HttpStatus = true;
    $scope.Transactions.selectedCustomerId = null;
    $scope.Transactions.selectedType = null;
    $scope.Transactions.getAllLoans = function () {

        var customerFilter = {};

        $scope.Transactions.selectedCustomerId = $routeParams.id;
        $scope.Transactions.selectedTxnType = $routeParams.type;

        if (!$routeParams.id) {
            $scope.Transactions.selectedCustomer = localStorageService.set('customerDetails', null)
        }

        var page = Math.abs($scope.Transactions.transactions.page) - 1;
        customerFilter.url = Transactions.GetTransactions + "/" + page + "/" + $scope.Transactions.selectedCustomerId + "/" + $scope.Transactions.selectedTxnType + "?search="
            + $scope.Transactions.transactions.search;

        $scope.Transactions.HttpStatus = true;

        HttpRequest.MakePostHttp(customerFilter).then(function (response) {
            var res = response;

            $scope.Transactions.HttpStatus = false;
            console.log(response);

            if (res.status == 1) {
                $scope.Transactions.transactions.initialLoad(res);
            } else {
                $scope.Transactions.transactions.data = [];
                $rootScope.showErrorType(res);

            }
        });

    };
    $scope.Transactions.selectedCustomer = {};
    $scope.Transactions.getCustomerDetails = function () {
        $scope.Transactions.selectedCustomer = localStorageService.get('customerDetails')
    }

    $scope.Transactions.filerName = '';

    $scope.Transactions.reloadForm = false;
    $scope.Transactions.newLoansModal = function () {
        if ($scope.loanForm)
            $scope.loanForm.$setUntouched();

        $scope.Transactions.reloadForm = false;
        $("#myModal").modal('show');
        $scope.Transactions.reloadForm = true;
    }

    $scope.Transactions.loanFormData = {};

    $scope.Transactions.saveLoan = function (loanData) {

        loanData.customerId = $scope.Transactions.loanFormData.customer.id;
        //check if its an edit or ne data
        loanData.url = Transactions.SaveTransaction;

        delete (loanData.customer);
        HttpRequest.MakePostHttp(loanData).then(function (response) {
            let res = response;
            if (res.status == 1) {
                $scope.Transactions.loanFormData = {};

                $("#myModal").modal('hide');
                $scope.Transactions.saveStatus = true;
                $timeout(function () {
                    $scope.Transactions.saveStatus = false;
                }, 3000);
                $scope.Transactions.getAllLoans();

            } else {
                showErrorType(res);
            }
        });


    }


})