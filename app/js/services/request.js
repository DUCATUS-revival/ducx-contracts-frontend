angular.module('Services').service('requestService', function($http, API, $rootScope, $q) {

    var sendErrorsIssuer = function(response) {
        switch (response.status) {
            case 500:
                $rootScope.globalError = {
                    text: "Internal service error.\nClick on the message to send us information",
                    type: 'error',
                    onclick: function() {}
                };
                break;
            case -1:
                $rootScope.globalError = {
                    type: 'warning',
                    text: 'Check your Internet connection'
                };
                break;
        }
    };

    return {
        get: function (params) {
            var defer = $q.defer();

            var url = API.HOSTS.TEST;
            url += params.API_PATH || API.HOSTS.PATH;
            url += params.path || '';

            var httpParams = {};
            httpParams.params = params.params || params.query;

            $http.get(url, httpParams).then(defer.resolve, function(response) {
                sendErrorsIssuer(response);
                defer.reject(response);
            });
            return defer.promise;
        },


        post: function (params) {
            var defer = $q.defer();
            var url = API.HOSTS.TEST;
            url += params.API_PATH || API.HOSTS.PATH;
            url += params.path || '';

            var requestOptions = {
                method: params.method || 'POST',
                url: url,
                data: params.data,
                params: params.params
            };
            if (params.headers) {
                requestOptions.headers = params.headers;
            }
            if (params.transformRequest) {
                requestOptions.transformRequest = params.transformRequest;
            }

            $http(requestOptions).then(defer.resolve, function(response) {
                sendErrorsIssuer(response);
                defer.reject(response);
            });
            return defer.promise;
        }
    }
});
