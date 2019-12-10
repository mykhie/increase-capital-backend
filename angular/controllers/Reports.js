var loans = angular.module('appModule');

loans.config(function ($routeProvider, $httpProvider, $locationProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $locationProvider.hashPrefix('');


});

loans.controller('ReportsController', function ($rootScope, $scope, $timeout, appService, $routeParams, localStorageService, HttpRequest) {

    $scope.Reports = {};

    /****
     * get customer list
     * */

    $scope.Reports.transactions = {
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
                    $scope.Reports.getAllLoans()
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
                    $scope.Reports.getAllLoans()
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
            $scope.Reports.getAllLoans();

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


    $scope.Reports.filterBy = 0;
    $scope.Reports.filterInvites = 0;

    $scope.Reports.filterByActions = function (type) {
        $scope.Reports.filterBy = type;
        $scope.Reports.transactions.page = 1;
        $scope.Reports.transactions.searchRecords();
    };

    $scope.Reports.HttpStatus = true;
    $scope.Reports.selectedCustomerId = null;
    $scope.Reports.selectedType = null;
    $scope.Reports.formData = {};
    $scope.Reports.getAllLoans = function () {

        let customerFilter = $scope.Reports.formData;


        $scope.Reports.selectedTxnType = $routeParams.type;

        if (!$routeParams.id) {
            $scope.Reports.selectedCustomer = localStorageService.set('customerDetails', null)
        }

        let page = Math.abs($scope.Reports.transactions.page) - 1;
        customerFilter.url = Reports.GetTransactions + "/" + page + "/" + $scope.Reports.selectedTxnType + "?search="
            + $scope.Reports.transactions.search;

        $scope.Reports.HttpStatus = true;

        HttpRequest.MakePostHttp(customerFilter).then(function (response) {
            var res = response;

            $scope.Reports.HttpStatus = false;
            console.log(response);

            if (res.status == 1) {
                $scope.Reports.transactions.initialLoad(res);
            } else {
                $scope.Reports.transactions.data = [];
                $rootScope.showErrorType(res);

            }
        });

    };

    $scope.Reports.downloadExcel = function () {

        let customerFilter = $scope.Reports.formData;


        $scope.Reports.selectedTxnType = $routeParams.type;

        customerFilter.url = Reports.downloadExcel + "/" + $scope.Reports.selectedTxnType + "?search="
            + $scope.Reports.transactions.search;

        $scope.Reports.HttpStatus = true;

        HttpRequest.MakePostHttp(customerFilter).then(function (response) {
            var res = response;

            $scope.Reports.HttpStatus = false;
            console.log(response);

            if (res.status == 1) {
                let win = window.open(BASE_URL + res.data, '_blank');
                win.focus();
            } else {

                $rootScope.showErrorType(res);

            }
        });

    };
    $scope.Reports.downloadPdf = function () {

        let customerFilter = $scope.Reports.formData;


        $scope.Reports.selectedTxnType = $routeParams.type;

        customerFilter.url = Reports.downloadPdf + "/" + $scope.Reports.selectedTxnType + "?search="
            + $scope.Reports.transactions.search;

        $scope.Reports.HttpStatus = true;

        HttpRequest.MakePostHttp(customerFilter).then(function (response) {
            var res = response;

            $scope.Reports.HttpStatus = false;
            console.log(response);

            if (res.status == 1) {
                let win = window.open(BASE_URL + res.data, '_blank');
                win.focus();
            } else {

                $rootScope.showErrorType(res);

            }
        });

    };


})