'use strict';
var module = angular.module('app');
module.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

    var templatesPath = '/templates/pages/';

    $stateProvider.state('main', {
        abstract: true,
        templateUrl: '/templates/common/main.html',
        controller: function() {},
        resolve: {
            currentUser: function($rootScope) {
                return $rootScope.currentUserDefer.promise;
            },
            translateReady: ['$translate', function($translate) {
                return $translate.onReady();
            }]
        }
    }).state('anonymous', {
        url: '/anonymous?:go?',
        template: '',
        title: '',
        resolve: {
            currentUser: function ($rootScope) {
                return $rootScope.currentUserDefer.promise;
            }
        },
        controller: function(currentUser, $state, authService, $stateParams, $location) {
            if (currentUser) {
                if (!$stateParams.go) {
                    currentUser.data.contracts ? $state.go('main.contracts.list') : $state.go('main.createcontract.types');
                } else {
                    $location.url(decodeURIComponent($stateParams.go));
                }
            }
        }

    }).state('reset', {
        url: '/reset/:uid/:token/',
        template: '',
        title: ' ',
        controller: function($stateParams) {
            window.location.href = '/auth/reset-password/' + $stateParams.uid + '/' + $stateParams.token;
        }
    }).state('exit', {
        url: '/logout',
        template: '',
        controller: function(authService) {
            authService.logout().then(function() {
                window.location.href = '/create';
            });
        }
    }).state('first_entry', {
        url: '/first_entry',
        resolve: {
            currentUser: function($rootScope) {
                return $rootScope.currentUserDefer.promise;
            }
        },
        controller: function(currentUser, $state, contractService, CONTRACT_TYPES_NAMES_CONSTANTS) {
            var localStorage = window.localStorage || {};
            if (localStorage.draftContract) {
                var data = JSON.parse(localStorage.draftContract);
                $state.go('main.createcontract.form', {
                    selectedType: CONTRACT_TYPES_NAMES_CONSTANTS[data.contract_type], network: data.network
                });
            } else {
                $state.go('main.base');
            }
        },
        title: 'start'

    }).state('main.base', {
        url: '/',
        controller: function(currentUser, $state) {
            currentUser.data.contracts ? $state.go('main.contracts.list') : $state.go('main.createcontract.types');
        },
        title: 'start'
    }).state('main.profile', {
        url: '/profile',
        controller: 'profileController',
        templateUrl: templatesPath + 'profile.html',
        title: 'Profile',
        resolve: {
        }
    }).state('main.buytokens', {
        url: '/buy',
        controller: 'buytokensController',
        templateProvider: function ($templateCache) {
            return $templateCache.get(templatesPath + 'buytokens.html');
        },
        data: {
            notAccess: 'is_ghost'
        },
        resolve: {
            currentUser: function(usersService, $rootScope) {
                return $rootScope.currentUserDefer.promise;
            },
            exRate: function(contractService, ENV_VARS, $q) {
                var defer = $q.defer();
                var loadedCurrencies = {};
                var loadedCurrenciesCount = 0;
                var currencies = ['DUCX','USDC'];
                var currentCurrency = 'USDC';

                var getRate = function(currency) {
                    contractService.getCurrencyRate({fsym: currency, tsyms: currentCurrency}).then(function(result) {
                        loadedCurrencies[currency] = (1 / result.data[currentCurrency]).toString();
                        loadedCurrenciesCount++;
                        if (loadedCurrenciesCount === currencies.length) {
                            defer.resolve({
                                data: loadedCurrencies
                            });
                        }
                    }, function() {
                        loadedCurrenciesCount++;
                    }).finally(function() {
                        if (loadedCurrenciesCount === currencies.length) {
                            defer.resolve({
                                data: loadedCurrencies
                            });
                        }
                    });
                };
                for (var k = 0; k < currencies.length; k++) {
                    getRate(currencies[k]);
                }
                return defer.promise;

            }
        }
    }).state('main.contracts', {
        abstract: true,
        template: '<div ui-view></div>',
        controller: 'baseContractsController'
    }).state('main.contracts.list', {
        url: '/contracts',
        controller: 'contractsController',
        templateUrl: templatesPath + 'contracts.html',
        resolve: {
            contractsList: function(contractService, $rootScope, currentUser) {
                return new Promise(function(resolve, reject) {
                    contractService.getContractsList({
                        limit: 8
                    }).then(function(result) {
                        resolve(result);
                    }, function() {
                        resolve(false);
                    });
                });

            }
        }
    }).state('main.contracts.preview', {
        abstract: true,
        controller: 'contractsPreviewController',
        templateUrl: templatesPath + 'contracts/preview.html',
        title: 'Contract preview',
        parent: 'main.contracts'
    }).state('main.contracts.preview.byId', {
        controllerProvider: function(openedContract, CONTRACT_TYPES_NAMES_CONSTANTS) {
            var contractTpl = CONTRACT_TYPES_NAMES_CONSTANTS[openedContract.data.contract_type];
            return contractTpl + 'PreviewController';
        },
        templateProvider: function ($templateCache, openedContract, CONTRACT_TYPES_NAMES_CONSTANTS) {
            var contractTpl = CONTRACT_TYPES_NAMES_CONSTANTS[openedContract.data.contract_type];
            return $templateCache.get(templatesPath + 'contracts/preview/' + contractTpl + '.html');
        },
        url: '/contracts/:id',
        resolve: {
            openedContract: function(contractService, $stateParams) {
                if (!$stateParams.id) return false;
                return contractService.getContract($stateParams.id);
            }
        },
        data: {
            top: 'main.contracts.list'
        }
    }).state('main.createcontract', {
        abstract: true,
        templateUrl: templatesPath + 'createcontract.html',
        controller: function($scope, $rootScope, $window, $q) {
            $scope.checkUserIsGhost = function() {
                if ($rootScope.currentUser.is_ghost) {

                    var defer = $q.defer();

                    /* Open authorisation window */
                    $rootScope.commonOpenedPopup = 'login';
                    $rootScope.commonOpenedPopupParams = {
                        'class': 'login-form',
                        'page': 'registration',
                        'onClose': function() {
                            destroyFocusEvent();
                            $rootScope.closeCommonPopup();
                        },
                        'onLogin': {
                            callback: defer.resolve
                        }
                    };

                    /* Destroy watchers */
                    var destroyFocusEvent = function() {
                        angular.element($window).off('focus', checkWindowFocus);
                    };

                    /* Check profile for window focus */
                    var checkWindowFocus = function() {
                        $rootScope.checkProfile(false, {
                            callback: defer.resolve
                        });
                    };

                    angular.element($window).on('focus', checkWindowFocus);
                    $scope.$on('$destroy', destroyFocusEvent);
                    return defer.promise;
                }
                return false;
            };
        }
    }).state('main.createcontract.types', {
        url: '/create?:blockchain?&:isTestNet?&:ext?',
        resolve: {
            allCosts: function(contractService) {
                return contractService.getAllCosts();
            }
        },
        controller: function($scope, allCosts, $stateParams, CONTRACT_TYPES_FOR_CREATE) {

            $scope.blockChainNetwork = {};
            $scope.blockChainNetwork.isTest = !!$stateParams.isTestNet;
            //
            for (var key in allCosts.data) {
                allCosts.data[key] = {
                    DUCX: new BigNumber(allCosts.data[key]['DUCX']+'').round(3).toString(10),
                    USDC: new BigNumber(allCosts.data[key]['USDC']+'').round(3).toString(10)
                };
            }
            $scope.allCosts = allCosts.data;

            $scope.contractsTypes = CONTRACT_TYPES_FOR_CREATE;

            $scope.redirectTo = function(link, e) {
                e.preventDefault();
                e.stopPropagation();
                location.href = link;
            };
            $scope.$on('$locationChangeSuccess', function(event, oldLocation, newLocation) {
                if (oldLocation === newLocation) return;
                $scope.blockChainNetwork.isTest = !!$stateParams.isTestNet;
            });
        },
        reloadOnSearch: false,
        templateUrl: templatesPath + 'createcontract/contract-types.html'

    }).state('main.createcontract.form', {
        url: '/create/:selectedType?:options?:network?:ext?',
        onEnter: function($stateParams, $state) {
            if (!$stateParams.network) {
                $state.go('main.createcontract.types');
            }
        },
        controllerProvider: function($stateParams) {
            return $stateParams.selectedType + 'CreateController';
        },
        templateProvider: function ($templateCache, $stateParams) {
            return $templateCache.get(templatesPath + 'createcontract/' + $stateParams.selectedType + '.html');
        },
        resolve: {
            currencyRate: function(contractService) {
                var curencyValue = 'DUC';
                // return 0;
                return contractService.getCurrencyRate({fsym: curencyValue, tsyms: 'USD'});
            },
            openedContract: function() {
                return false;
            },
            tokensList: function($stateParams, contractService) {
                if ($stateParams.selectedType === 'crowdSale') {
                    return contractService.getTokenContracts($stateParams.network || 18);
                }
                return undefined;
            }
        },
        parent: 'main.createcontract'
    }).state('main.createcontract.edit', {
        url: '/contracts/edit/:id',
        controllerProvider: function(openedContract, CONTRACT_TYPES_NAMES_CONSTANTS) {
            openedContract.data.contract_details.duc_contract = undefined;
            var contractType = CONTRACT_TYPES_NAMES_CONSTANTS[openedContract.data.contract_type];
            return contractType + 'CreateController';
        },
        templateProvider: function ($templateCache, openedContract, CONTRACT_TYPES_NAMES_CONSTANTS) {
            var contractType = CONTRACT_TYPES_NAMES_CONSTANTS[openedContract.data.contract_type];
            return $templateCache.get(templatesPath + 'createcontract/' + contractType + '.html');
        },
        resolve: {
            openedContract: function(contractService, $stateParams) {
                if (!$stateParams.id) return false;
                return contractService.getContract($stateParams.id);
            },
            currencyRate: function(contractService) {
                var curencyValue = 'DUC';
                // return 0;
                return contractService.getCurrencyRate({fsym: curencyValue, tsyms: 'USD'});
            },
            tokensList: function($stateParams, contractService, CONTRACT_TYPES_NAMES_CONSTANTS, openedContract) {
                if (CONTRACT_TYPES_NAMES_CONSTANTS[openedContract.data.contract_type] === 'crowdSale') {
                    return contractService.getTokenContracts(openedContract.data.network || 1);
                }
                return undefined;
            }
        },
        onEnter: function(openedContract, CONTRACT_STATUSES_CONSTANTS, $state) {
            if (CONTRACT_STATUSES_CONSTANTS[openedContract.data.state]['value'] > 1) {
                $state.go('main.contracts.preview.byId', {id: openedContract.data.id});
            }
        },
        data: {
            top: 'main.contracts.list'
        }
    });



    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $urlRouterProvider.otherwise('/');

});
