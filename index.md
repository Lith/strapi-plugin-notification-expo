# strapi-plugin-notification-expo

![npm](https://img.shields.io/npm/v/strapi-plugin-notification-expo?style=flat-square)
![npm](https://img.shields.io/npm/dm/strapi-plugin-notification-expo?style=flat-square)
![GitHub package.json version](https://img.shields.io/github/package-json/v/Lith/strapi-plugin-notification-expo?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Lith/strapi-plugin-notification-expo?style=flat-square)
![Gitlab code coverage](https://img.shields.io/gitlab/coverage/Lith/strapi-plugin-notification-expo/master?style=flat-square)

**(Non-official)** Strapi plugins to send Expo notifications

## Installation

Install the package from your app root directory

With `npm`
```shell
npm install strapi-plugin-notification-expo
```
or `yarn`
```shell
yarn add strapi-plugin-notification-expo
```

## Introduction

This plugin allow you to draft & publish Expo notification

### Feature
- Used `Draft and Publish` Strapi feature
- Build with [Buffetjs.io](https://www.buffetjs.io/)
- Follow Strapi rules and requirement

### Include
- Administration panel with the list of all Notification, add, planify, edit and publish your notification in a click
- Automatic publish with a dedicated cron
- Read-only notification send

### Information
This plugin will add 3 tables into your project :
- `expotokens` : list of all Expo tokens (platform, "Expo push token", user)
- `exponotifications`: list of all Notification with a state
- `exponotifications_users` : list of all users than will received the notification

## Requirement

### Edit `config/server.js`

This project launch a Cron Task to check every 10 minutes if notification need to be send, so you need to enabled `cron` in `config/server.js` :

```json
    cron: {
      enabled: true,
    },
```

If you want disable cron task on staging or development environment, edit `config/env/development/server.js` and disabled `cron`.

### Edit `config/middleware.js`

Enable the plugin's cron : 

```json
    expoCron: {
      enabled: true,
    },
```
        
# FAQ

## How to register token from Expo to Strapi ?

In your app, add some code to register the token linked to the user account on Strapi API :

```typescript
Permissions
            .askAsync(Permissions.NOTIFICATIONS)
            .then(({status}) => {
                if (status === 'granted') {
                    return Notifications.getExpoPushTokenAsync();
                }
                return Promise.reject();
            })
            .then((token) => {
                return api
                    .post('/notification-expo/expotokens', {
                        token,
                        platform: Platform.OS
                    })
                    .catch((err) => {
                        if (err && err.statusCode === 409) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject(err);
                        }
                    })
                    .then(() => dispatch(registerNotificationsTokenSuccess(
                        Notifications.addListener((notification) => {
                            dispatch(notify(notification))
                        })
                    )))
            })
            .catch((err) => dispatch(registerNotificationsTokenFail(err)))
```
