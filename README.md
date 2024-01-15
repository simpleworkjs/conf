## Useage

Install the package using
```bash
npm install --save npm i @simpleworkjs/conf
```

In your project, make a `conf` or `settings`  directory or where ever you would
like to save configuration files. Make a `index.js` with:

```js
module.export = require('npm i @simpleworkjs/conf')
```

and require the `conf` directory where ever in your project you want to the
conf object.

It required to have a base conf file like `base.js` or `base.JSON`. Optionaly,
you can have a `production`, `development`, `secrets` conf file.

**It is highly recommended you git ignore the secrets file**


## What is a conf object?

A Configuration Object (key:value pair) holds run time variables that will be
used thought out the app. These variables include things like server address
for API's and data base, username/password/tokens, limits for actions, what
should be logged, and much more. There are several ways to handle runtime
configuration. Some of these variables are sensitive information you do not want
to be included in the git repo. For the rest of this document, we will follow a
multi-tired settings strategy inspired by Django. The terms "settings",
"configuration", "conf" will used interchangeable.

The goal is to build a single Object comprising `key: value` pairs of the
settings your project needs when it runs. We dont want to hard code these values
for a number of reasons, take the following settings object:

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

Based on the above, lets look at some main reasons we cant get by with a single
configuration file:

1) Things like `featureAPI.url` and `logPath` will likely change depending one
where (production, staging, local dev) the app is running. So we want to be able
to define settings based on the current environment.

2) `featureAPI.token` is a secret we dont want to share with the world. We dont
want that information tracked in the git repo.

3) `copyrightMessage` is a rather generic and universal thing we want used
everywhere.

Based on these requirements, we will have 3 "configuration files" that over ride
each other.

```
base.js
production.js or development.js or any other environment name that makes sense
secrets.js
```

`base.js` and the environment conf files will be tracked in the repo for the
world to see. `secrets.js` will be ignored by the git repo, as its to hold
secrets and settings that only pertain to the local useage.

The `base.js` file will be loaded first. Then the environment file matching the
current environment will be loaded, overwriting any values in base. Finlay,
`secrets.js` is loaded, overwriting any files from both base and environment.

The only required file is `base.js`. The app will throw warning to the console
if an environment and/or `secrets.js` are not found, but the app will run.