let appservice = angular.module('appModule');

appservice.service('appService', function () {
    this.AppServiceObject = {};

    this.AppServiceObject.returnFormValue = function (formObject) {
        return formObject.$viewValue;
    }
    this.AppServiceObject.dateToday = function () {

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() ; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

            mm = monthNames[mm];

        return dd + ' ' + mm + ' ' + yyyy;
    }

    this.AppServiceObject.returnNameSymbols = function (name) {
        let str = name;
        let matches = str.match(/\b(\w)/g);
        if(!matches)
            return "C";

        let acronym = matches.join('');

        return acronym.toUpperCase();
    }
});
appservice.factory('HttpRequest', function ($http, $q, $rootScope) {
   let HttpHolder = {};

    HttpHolder.MakeGetDataHttp = function (filterData) {
       let url = filterData.url;
        delete filterData.url;

       let request = $http(
            {
                method: 'post',
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: {
                    filterData: filterData
                }
            });
        return (request.then(handleSuccess, handleError));
    }


    HttpHolder.MakePostHttp = function (saveData, callback) {
       let url = saveData.url;
        delete saveData.url;

       let request = $http(
            {
                method: 'post',
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: {
                    saveData: saveData
                }
            });
        return (request.then(handleSuccess, handleError));
    }


    HttpHolder.MakeGetHttpTest = function (callback) {
       let request = $http({
            method: "get",
            url: url,
            params: {
                action: "get"
            }
        });
        return (request.then(handleSuccess, handleError));
    }


    function handleError(response) {

        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
       let jsAlert = $.alert({
            title: '<i class="fa fa-2x  fa-exclamation-triangle text-danger"></i> SERVER ERROR',
            content: 'Server  couldn\'t be reached or an error occured,please try again.'
        });

        if (
            !angular.isObject(response.data) ||
            !response.data.message
        ) {
            return ($q.reject("An unknown error occurred."));
        }
        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));
    }

    // I transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess(response) {

        return (response.data);

    }


    return HttpHolder;
})