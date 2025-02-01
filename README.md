## Usage

Install the package using

```bash
npm install --save @simpleworkjs/conf
```

In your project, make a `conf` directory at the same level as the
`node_modules` folder. This folder should look like:

 ```
/node_modules
/conf
├── base.js 		<-- required, parsed first 
├── production.js	<-- optional, based on the ENV variable
├── development.js
├── other_env_name.js	<-- ENV can be what ever name you want...
└── secrets.js 		<-- optional, parsed last and should be in .gitignore file!
```

These files can be standard JSON or a JS file that declare a `module.exports` with an object.

Example `base.js`
```js
module.exports = {
	ldap: {
		url: 'ldap://ldap.local',
		bindDN: 'cn=ldapclient service,ou=people,dc=theta42,dc=com',
		bindPassword: '__IN SRECREST FILE__',
	},
	sql: {
		"storage": "database_test.sqlite",
		"dialect": "sqlite",
	},
};
```
Example `secrets.js`
```js
module.exports = {
	ldap: {
		bindPassword: 'Hunter123',
	}
};
```

Require and use in any file you like.

```js
const conf = require('@simpleworkjs/conf');

console.log(conf.ldap)
// {
//	url: 'ldap://ldap.local',
//	bindDN: 'cn=ldapclient service,ou=people,dc=theta42,dc=com',
//	bindPassword: 'Hunter123',
//}
```

**It is highly recommended you git ignore the secrets file**

## What is a conf object?

A Configuration Object (key:value pair) holds run time variables that will be
used throughout the app. These variables include things like server address
for API's and database, username/password/tokens, limits for actions, what
should be logged, and much more. There are several ways to handle runtime
configuration. Some of these variables are sensitive information you do not want
to be included in the git repo. For the rest of this document, we will follow a
multi-tiered settings strategy inspired by Django. The terms "settings",
"configuration", "conf" will used interchangeably.

The goal is to build a single Object comprising `key: value` pairs of the
settings your project needs when it runs. We dont want to hardcode these values
for several reasons, take the following settings object:

```js
{
	copyrightMessage: "myCoolApp © 2024 ",
	featureAPI:{
		url: "https://api.coolCompany.com/api/v0",
		token: '234-234sdf-23s-sdf2323sdf-sdfe234-'
	},
	logInfo: false,
	logPath: '/var/log/myCoolApp/app.log'
}
```

Based on the above, let's look at some main reasons we can't get by with a single
configuration file:

1) Things like `featureAPI.url` and `logPath` will likely change depending one
where (production, staging, local dev) the app is running. So we want to be able
to define settings based on the current environment.

2) `featureAPI.token` is a secret we don't want to share with the world. We don't
want that information tracked in the git repo.

3) `copyrightMessage` is a rather generic and universal thing we want to use
everywhere.

Based on these requirements, we will have 3 "configuration files" that override
each other.

```
base.js
production.js or development.js or any other environment name that makes sense
secrets.js
```

`base.js` and the environment conf files will be tracked in the repo for the
world to see. `secrets.js` will be ignored by the git repo, as it holds
secrets and settings that only pertain to local useage.

The `base.js` file will be loaded first. Then the environment file matching the
current environment will be loaded, overwriting any values in base. Finlay,
`secrets.js` is loaded, overwriting any files from both the base and environment.

The only required file is `base.js`. The app will throw a warning to the console
if an environment and/or `secrets.js` are not found, but the app will run.
