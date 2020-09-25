'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  create: async ctx => {
    /**
     * Check if token already exist
     */
    const results = await strapi.services.expotoken.find({token: ctx.request.body.token});

    if (results.length) {
      return await ctx.response.conflict('Token already exist');
    } else {
      /**
       * Token doesn't exist, well... we add it !
       */
      return await strapi.services.expotoken.create(ctx.request.body);
    }
  },

  send: async (ctx, params) => {
    /**
     * params = {
     *   customer
     *   title
     *   body
     * }
     */
    return await strapi.plugins.automation.controllers.expo.send(ctx, params);
  }
};
