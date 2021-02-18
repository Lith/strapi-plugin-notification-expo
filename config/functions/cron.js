'use strict';

module.exports = {
  /**
   * Check every 10 minutes pending expo notifications
   */

  '*/10 * * * *': () => {
    strapi.plugins['notification-expo'].services.expo.sendPendingNotification();
  },
};
