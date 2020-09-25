# strapi-plugin-notification-expo

This is a plugin of "expo notification" for Strapi. 

_Working with Strapi 3.\*.\* (beta and stable)_

### /!\ Example Draft /!\ 

This is an example of implementation, adapt it for your case by copy/paste file (or code needed).

An installable version is work in progress with an administration panel parts.


_Just to give inspiration to others_


## Expo 

### Requirement 

Install the expo server SDK package  

```shell script
yarn add expo-server-sdk
```

### Add expotokens 'model' into Strapi API

You need to register Expo token before send a notification to a user.

This models allow us to save information in database, but you are free to use an other solution.

Keep in mind than a user can have many devices, each user can receive notifications on an iPad, Android, iPhone, ...etc


### Register token from Expo to Strapi

In your app, add some code to register the token linked to the user account on Strapi API :

_Be careful, I'm not a React developer, so this code is an ugly example_
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
                    .post('/expotokens', {
                        userId,
                        token
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

### Send a notification to user

Copy plugins files, adapt the code with your own style.

##### Example with an "inner" notification, use it from existing controller method

```javascript
...
    const datasExpo = {
      customer: userId, // you need to have this information before :)
      title: '✅ Awesome title',
      body: 'Content of your notification',
      data: {
        url: 'myapp://deeplinking/pages' // useful if you want to redirect customer to the good screen
      },
      channelId: `channel_name` // change this with
    };
    await strapi.plugins.notification.services.expo.send(ctx, datasExpo);
...
```
