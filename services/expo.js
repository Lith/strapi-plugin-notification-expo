'use strict';

/**
 * expo.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require('lodash');
const notificationMessage = require('./utils/notificationMessage');

module.exports = {
  /**
   * Method used for send notification to specific users from api controllers & services
   * Never use this method with Strapi ADMIN
   *
   * @returns {Promise<void>}
   */

  async send(ctx, params) {
    const pushTokens = await strapi.plugins['notification-expo'].services.expotoken.find({
      user: params.user,
    }, []);

    if (pushTokens) {
      await notificationMessage.send(params, pushTokens.map((pushToken) => pushToken.token));
    }
  },

  /**
   * Send expo notification
   * @param notification
   * @returns {Promise<void>}
   */

  async sendNotification(params) {
    let expotokens = [];

    if (params.users && params.users.length) {
      const users = params.users.map((user) => user.id);
      expotokens = await strapi
        .query('expotoken', 'notification-expo')
        .find({user_in: users}, []);
    }

    if (!expotokens || !expotokens.length) return;

    await strapi
      .query('exponotification', 'notification-expo')
      .update({id: params.id}, {status: 'waiting'});
    await notificationMessage.send(
      params,
      expotokens.map((item) => item.token)
    );
    await strapi
      .query('exponotification', 'notification-expo')
      .update({id: params.id}, {status: 'finished'});
  },

  /**
   * Send pending notification
   * @returns {Promise<void>}
   */

  sendPendingNotification: async () => {
    const params = {
      status: 'pending',
      total_gt: 0,
      published_at_lte: new Date(),
    };

    const notifications = await strapi
      .query('exponotification', 'notification-expo')
      .find(params, ['users']);

    _.forEach(notifications, async (notification) => {
      await strapi.plugins['notification-expo'].services.expo.sendNotification(notification);
    });
  },
};
