var app = angular.module('appModule', [
    'ngRoute', 'LocalStorageModule']);

app.config(function ($routeProvider, $httpProvider, $locationProvider) {

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $locationProvider.hashPrefix('');
    $routeProvider.when('/',
        {
            templateUrl: 'partials/customers.html',
            reloadOnSearch: false
        });
    $routeProvider.when('/loans/:id?/:type?',
        {
            templateUrl: 'partials/loans.html',
            reloadOnSearch: false
        });
    $routeProvider.when('/reports/:type?',
        {
            templateUrl: 'partials/reports.html',
            reloadOnSearch: false
        });
    $routeProvider.when('/logout',
        {
            templateUrl: 'partials/logout.html',
            reloadOnSearch: false
        });
    $routeProvider.otherwise({
        templateUrl: 'partials/page_not_found.html'
    });

})

app.controller('MainController', function ($rootScope, $scope, $timeout, appService, localStorageService, HttpRequest) {

    $scope.customers = {};
    $scope.customers.currentMenu = 'customers';

    $scope.customers.updateCurrentMenu = function (menu) {

        $scope.customers.currentMenu = menu;
    }

    $scope.customers.branches = [
        {name: 'Branch 1', id: 1},
        {name: 'Branch 2', id: 2},
        {name: 'Branch 3', id: 3},
    ];
    $scope.customers.showMenu = true;

    $scope.customers.togglemenu = function () {
        if (!$scope.customers.showMenu) {
            $('#sidebar').removeClass('active');
        } else {
            $('#sidebar').addClass('active');
        }
        $scope.customers.showMenu = !$scope.customers.showMenu;
    }


    $scope.customers.filerName = "Branch";
    $scope.customers.customerFormData = {}

    /***
     * regualr expressions
     * */

    $scope.customers.regex = {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        mobile: /^07[0-9]{8}$/,
        name: /^[a-zA-Z](?:[.' /]?[a-zA-Z0-9 ]+)*$/,
        loan: /^[0-9]{1,5}$/
    }

    $scope.customers.validateEmail = function (email) {
        console.log(email)
    };

    /***
     * branch array declaration
     * **/
    $scope.customers.customerData = [];
    $scope.customers.reloadForm = false;
    $scope.customers.saveStatus = false;
    /***
     * Save customer to local storage
     * */
    $scope.customers.saveCustomer = function (customerFormData) {


        //check if its an edit or ne data
        customerFormData.url = CUSTOMER.SaveCustomers;

        HttpRequest.MakePostHttp(customerFormData).then(function (response) {
            let res = response;
            if (res.status == 1) {
                $scope.customers.customerFormData = {};
                $("#myModal").modal('hide');
                $scope.customers.saveStatus = true;

                $timeout(function () {
                    $scope.customers.saveStatus = false;
                }, 3000);

                $scope.customers.getAllCompanyClients();

            } else {
                showErrorType(res);
            }
        });

    }

    $scope.customers.saveTempCustomer = function (customer) {
        localStorageService.set('customerDetails', customer);
    }


    /****
     * get customer list
     * */

    $scope.customers.customers = {
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
                    $scope.customers.getAllCompanyClients()
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
                    $scope.customers.getAllCompanyClients()
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
            $scope.customers.getAllCompanyClients();

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


    $scope.customers.filterBy = 0;
    $scope.customers.filterInvites = 0;

    $scope.customers.filterByActions = function (type) {
        $scope.customers.filterBy = type;
        $scope.customers.customers.page = 1;
        $scope.customers.customers.searchRecords();
    };

    $scope.customers.HttpStatus = true;
    $scope.customers.getAllCompanyClients = function () {

        var customerFilter = {};


        var page = Math.abs($scope.customers.customers.page) - 1;
        customerFilter.url = CUSTOMER.GetCustomers + "/" + page + "/" + "?search="
            + $scope.customers.customers.search;

        $scope.customers.HttpStatus = true;

        HttpRequest.MakePostHttp(customerFilter).then(function (response) {
            var res = response;

            $scope.customers.HttpStatus = false;
            console.log(response);

            if (res.status == 1) {
                $scope.customers.customers.initialLoad(res);
            } else {
                $scope.customers.customers.data = [];
                $rootScope.showErrorType(res);

            }
        });

    };
    $scope.customers.status = {};
    $rootScope.showErrorType = function (res) {
        $scope.customers.status = {
            status: res.status,
            show: true,
            message: res.message
        }
    }

    /****
     * update the existing customer
     * */
    $scope.customers.updateCustomer = function (customerData) {

        for (let i = 0; i < $scope.customers.customerData.length; i++) {

            if ($scope.customers.customerData[i].id == customerData.id) {
                $scope.customers.customerData[i] = customerData;
                break;

            }

        }

        localStorageService.set('customerDataArray', $scope.customers.customerData)
        $scope.customers.reloadForm = false;
    }

    $scope.customers.updateLocalStorage = function (customerData) {
        $scope.customers.customerData.push(customerData);
        localStorageService.set('customerDataArray', $scope.customers.customerData)

        $scope.customers.reloadForm = false;
    }
    /****
     * update the local storage
     * */
    $scope.setFile = function (element) {
        $scope.currentFile = element.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            $scope.customers.customerFormData.image = event.target.result
            $scope.$apply()

        }

        reader.readAsDataURL(element.files[0]);
    }


    $scope.customers.setCustomerDataArrayList = function () {
        if (localStorageService.get('customerDataArray')) {
            $scope.customers.customerData = localStorageService.get('customerDataArray');
        }
    }

    $scope.customers.delete = function (customer) {
        var indexOf = $scope.customers.customerData.indexOf(customer);
        $scope.customers.customerData.splice(indexOf, 1);
        localStorageService.set('customerDataArray', $scope.customers.customerData)
    }

    $scope.customers.newCustomerModal = function () {
        if ($scope.customerForm)
            $scope.customerForm.$setUntouched();

        $scope.customers.reloadForm = false;
        $("#myModal").modal('show');
        $scope.customers.reloadForm = true;
    }


    $scope.loans = {}

    $scope.loans.loansDataArray = [];

    $scope.loans.loanTypes = [
        {name: 'Monthly', id: 1},
        {name: 'Annually', id: 2},
        {name: 'Accumulated', id: 3},
    ];
    $scope.customers.gender = [
        {name: 'Male', id: 1},
        {name: 'Female', id: 2},
        {name: 'Other', id: 3},
    ];

    $scope.loans.loansDataArray = [];

    $scope.loans.filerName = '';

    $scope.loans.reloadForm = false;
    $scope.loans.newLoansModal = function () {
        if ($scope.loanForm)
            $scope.loanForm.$setUntouched();

        $scope.loans.reloadForm = false;
        $("#myModal").modal('show');
        $scope.loans.reloadForm = true;
    }

    $scope.loans.loanFormData = {};

    $scope.loans.saveLoan = function (loanData) {
        loanData.date = appService.AppServiceObject.dateToday();

        if (loanData.id) {

            $scope.loans.updateLoans(loanData);

        } else {
            $scope.loans.updateLocalStorage(loanData);
        }
        $scope.loans.loanFormData = {};
        $("#myModal").modal('hide');

        $("#loan").modal('hide');
        $scope.loans.saveStatus = true;
        $timeout(function () {
            $scope.loans.saveStatus = false;
        }, 3000);

    }

    $scope.loans.updateLoans = function (loanData) {

        for (let i = 0; i < $scope.loans.loansDataArray.length; i++) {

            if ($scope.loans.loansDataArray[i].id == loanData.id) {
                $scope.loans.loansDataArray[i] = loanData;
                break;

            }

        }
        localStorageService.set('loanDataArray', $scope.loans.loansDataArray)
        $scope.loans.reloadForm = false;
    }

    $scope.loans.updateLocalStorage = function (loanData) {

        loanData.id = "L0000" + ($scope.loans.loansDataArray.length + 1);
        $scope.loans.loansDataArray.push(loanData);
        localStorageService.set('loanDataArray', $scope.loans.loansDataArray)
    }

    $scope.customers.returnInitials = function (name) {
        return appService.AppServiceObject.returnNameSymbols(name);
    }


    $scope.loans.delete = function (loan) {
        let indexOf = $scope.loans.loansDataArray.indexOf(loan);
        $scope.loans.loansDataArray.splice(indexOf, 1);
        localStorageService.set('loanDataArray', $scope.loans.loansDataArray)
    }

    $scope.loans.setLoansDataArrayList = function () {
        if (localStorageService.get('loanDataArray')) {
            $scope.loans.loansDataArray = localStorageService.get('loanDataArray');
        }
    }


});

app.directive('mandatoryField', function () {
    return {
        template: "<b class='text-danger' > *</b> "
    };
});