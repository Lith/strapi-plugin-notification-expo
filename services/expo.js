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
    // @todo - manage expo_access_token
    // let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

    const pushTokens = await strapi.plugins['notification-expo'].services.expotoken.find({
      user: params.id,
    });
    await notificationMessage.send(ctx, params, pushTokens);
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
        .find({ user_in: users }, []);
    }

    if (!expotokens || !expotokens.length) return;

    await strapi
      .query('exponotification', 'notification-expo')
      .update({ id: params.id }, { status: 'waiting' });
    const state = await notificationMessage.send(
      params,
      expotokens.map((item) => item.token)
    );
    if (state) {
      await strapi
        .query('exponotification', 'notification-expo')
        .update({ id: params.id }, { status: 'finished' });
    } else {
      await strapi
        .query('exponotification', 'notification-expo')
        .update({ id: params.id }, { status: 'failed' });
    }
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
