console.log('Starting password manager...');

var storage = require('node-persist');
storage.initSync();

var crypto = require('crypto-js');

var argv = require('yargs')
    .command('create', 'Create an entry to store some service credentials.', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Service name.',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'The username or email for the account.',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'The password for the account.',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'The master password to access the system.',
                type: 'string'
            }
        }).help('help');
    })
    .command('get', 'Fetch credentials for a particular service.', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Service name.',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'The master password to access the system.',
                type: 'string'
            }
        }).help('help');
    })
    .help('help')
    .argv;

function getAccounts (masterPassword) {
    var encryptedAccount = storage.getItemSync('accounts');
    var accounts = [];

    if (typeof encryptedAccount !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    return accounts;
}

function saveAccounts (accounts, masterPassword) {
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

    storage.setItemSync('accounts', encryptedAccounts.toString());

    return accounts;
}

function createAccount (account, masterPassword) {
    var accounts = getAccounts(masterPassword);

    accounts.push(account);

    saveAccounts(accounts, masterPassword);

    return account;
}

function getAccount (accountName, masterPassword) {
    var accounts = getAccounts(masterPassword);
    var foundAccount = null;

    for(var iterator = 0; iterator < accounts.length; iterator++) {
        if(accounts[iterator].name === accountName) {
            foundAccount = accounts[iterator];
        }
    }

    return foundAccount;
}

if(argv._[0] === 'create') {
    try {
        var createdAccount = createAccount({
            name: argv.name, 
            username: argv.username, 
            password: argv.password
        }, argv.masterPassword);

        console.log('Account created!');
        console.log(createdAccount);
    } catch (error) {
        console.log('Unable to create account!');
    }
}

if(argv._[0] === 'get') {
    try {
        var account = getAccount(argv.name, argv.masterPassword);

        if(account === null) {
            console.log('Account not found!');
        } else {
            console.log('Account found!');
            console.log(account);
        }
    } catch (error) {
        console.log('Unable to fetch account!');
    }
}
