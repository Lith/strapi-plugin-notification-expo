'use strict';

module.exports = {

  /**
   * Send expo notification
   */
  send: async (ctx, params) => {
    return strapi.plugins.automation.services.expo.send(ctx, params);
  }
};
