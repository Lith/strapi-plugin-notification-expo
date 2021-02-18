'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Object|Array}
   */

  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.plugins['notification-expo'].services.expotoken.search(ctx.query);
    } else {
      entities = await strapi.plugins['notification-expo'].services.expotoken.find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.plugins['notification-expo'].models.expotoken })
    );
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.plugins['notification-expo'].services.expotoken.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.plugins['notification-expo'].models.expotoken });
  },

  /**
   * Count records.
   *
   * @return {Number}
   */

  async count(ctx) {
    if (ctx.query._q) {
      return strapi.plugins['notification-expo'].services.expotoken.countSearch(ctx.query);
    }
    return strapi.plugins['notification-expo'].services.expotoken.count(ctx.query);
  },

  /**
   * Create a new expo tokens entry for logged customer
   * @param ctx
   * @returns {Promise<*>}
   */
  async create(ctx) {
    let entity;

    /**
     * Check if token already exist
     */
    const results = await strapi.plugins['notification-expo'].services.expotoken.find({
      token: ctx.request.body.token,
    });

    if (results.length) {
      return await ctx.response.conflict('Token already exist');
    } else {
      /**
       * Token doesn't exist, well... we add it !
       */
      entity = await strapi.plugins['notification-expo'].services.expotoken.create({
        ...ctx.request.body,
        user: ctx.state.user.id,
      });
    }
    return sanitizeEntity(entity, { model: strapi.plugins['notification-expo'].models.expotoken });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    entity = await strapi.plugins['notification-expo'].services.expotoken.update(
      { id },
      ctx.request.body
    );

    return sanitizeEntity(entity, { model: strapi.plugins['notification-expo'].models.expotoken });
  },

  /**
   * Destroy a record.
   *
   * @return {Object}
   */

  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.plugins['notification-expo'].services.expotoken.delete({ id });
    return sanitizeEntity(entity, { model: strapi.plugins['notification-expo'].models.expotoken });
  },
};
