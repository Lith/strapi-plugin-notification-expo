'use strict';

module.exports = {
  /**
   * Send direct expo notification from an other api controllers/services
   *
   * @returns {Promise<*>}
   */

  async send(ctx, params) {
    return strapi.plugins['notification-expo'].services.expo.send(ctx, params);
  },

  /**
   * Send pending notification (use for test or execute manually the cron task)
   * @returns {Promise<*|void>}
   */
  async sendPendingNotification() {
    return strapi.plugins['notification-expo'].services.expo.sendPendingNotification();
  },
};
