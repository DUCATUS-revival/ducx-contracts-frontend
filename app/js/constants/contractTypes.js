var module = angular.module('Constants');
module.constant('CONTRACT_TYPES_CONSTANTS', {
    'LAST_WILL': 0,
    'LOST_KEY': 1,
    'DEFERRED': 2,
    'SHOPPING': 3,
    'CROWD_SALE': 4,
    'TOKEN': 5,
    'TOKEN_NEO': 6,
    'CROWDSALE_NEO': 7,
    'AIRDROP': 8,
    'INVESTMENT_PULL': 9,
    'EOS_TOKEN': 10
}).constant('CONTRACT_TYPES_NAMES_CONSTANTS', {
    0: 'lastWill',
    1: 'lostKey',
    2: 'deferred',
    3: 'shopping',
    4: 'crowdSale',
    5: 'token',
    6: 'token',
    7: 'crowdSale',
    8: 'airdrop',
    9: 'investmentPull',
    10: 'eosToken'
}).service('CONTRACT_TYPES_FOR_CREATE', function(CONTRACT_TYPES_NAMES_CONSTANTS, ENV_VARS) {
    var eth = {
        'networks': [1, 2],
        'list':[{
            'icon': 'icon-crowdsale',
            'title': 'PAGES.CREATE_CONTRACT.CROWDSALE.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.CROWDSALE.DESCRIPTION',
            'typeNumber': 4,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[4],
            'price': true
        }, {
            'icon': 'icon-token',
            'title': 'PAGES.CREATE_CONTRACT.TOKEN.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.TOKEN.DESCRIPTION',
            'typeNumber': 5,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[5],
            'price': true
        }, {
            'icon': 'icon-airdrop',
            'title': 'PAGES.CREATE_CONTRACT.AIRDROP.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.AIRDROP.DESCRIPTION',
            'typeNumber': 8,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[8],
            'price': true
        }, {
            'icon': 'icon-investment-pool',
            'title': 'PAGES.CREATE_CONTRACT.INVESTMENT_POOL.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.INVESTMENT_POOL.DESCRIPTION',
            'typeNumber': 9,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[9],
            'price': true
        }, {
            'icon': 'icon-key',
            'title': 'PAGES.CREATE_CONTRACT.LOST_KEY.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.LOST_KEY.DESCRIPTION',
            'typeNumber': 1,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[1]
        }, {
            'icon': 'icon-deferred',
            'title': 'PAGES.CREATE_CONTRACT.DEFERRED.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.DEFERRED.DESCRIPTION',
            'typeNumber': 2,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[2]
        }, {
            'icon': 'icon-lastwill',
            'title': 'PAGES.CREATE_CONTRACT.WILL.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.WILL.DESCRIPTION',
            'typeNumber': 0,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[0]
        }, {
            'icon': 'icon-wedding',
            'title': 'PAGES.CREATE_CONTRACT.WEDDING.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.WEDDING.DESCRIPTION',
            'type:': 'wedding'
        }]
    };

    var neo = {
        'networks': [6, 6],
        'list': [{
            'icon': 'icon-token',
            'title': 'PAGES.CREATE_CONTRACT.TOKEN.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.TOKEN.DESCRIPTION',
            'typeNumber': 6,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[6]
        }, {
            'icon': 'icon-crowdsale',
            'title': 'PAGES.CREATE_CONTRACT.CROWDSALE.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.CROWDSALE.DESCRIPTION',
            'typeNumber': 7,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[7]
        }]
    };

    var rsk = {
        'networks': [3, 4],
        'list': [{
            'icon': 'icon-lastwill',
            'title': 'PAGES.CREATE_CONTRACT.WILL.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.WILL.DESCRIPTION',
            'typeNumber': 0,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[0]
        }]
    };

    var eos = {
        'networks': [10, 11],
        'list': [{
            'icon': 'icon-token-eos',
            'title': 'PAGES.CREATE_CONTRACT.TOKEN.TITLE',
            'description': 'PAGES.CREATE_CONTRACT.TOKEN.DESCRIPTION',
            'typeNumber': 10,
            'type': CONTRACT_TYPES_NAMES_CONSTANTS[10]
        }]
    };

    switch (ENV_VARS.mode) {
        case 'eos':
            return {
                EOS: eos
            };
            break;
        default:
            return {
                ETH: eth,
                NEO: neo,
                RSK: rsk
            };
            break;
    }
});
