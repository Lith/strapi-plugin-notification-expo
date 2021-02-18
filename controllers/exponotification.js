'use strict';

const _ = require('lodash');
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Object|Array}
   */

  async find(ctx) {
    const method = _.has(ctx.query, '_q') ? 'searchPage' : 'findPage';

    const { results, pagination } = await strapi.plugins[
      'notification-expo'
    ].services.exponotification[method](ctx.query);

    ctx.body = {
      data: {
        results: results.map((entity) =>
          sanitizeEntity(entity, {
            model: strapi.plugins['notification-expo'].models.exponotification,
          })
        ),
        pagination,
      },
    };
  },

  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.plugins['notification-expo'].services.exponotification.findOne({
      id,
    });
    return sanitizeEntity(entity, {
      model: strapi.plugins['notification-expo'].models.exponotification,
    });
  },

  /**
   * Count records.
   *
   * @return {Number}
   */

  count(ctx) {
    if (ctx.query._q) {
      return strapi.plugins['notification-expo'].services.exponotification.countSearch(ctx.query);
    }
    return strapi.plugins['notification-expo'].services.exponotification.count(ctx.query);
  },

  /**
   * Create a record
   *
   * @param ctx
   * @return {Object}
   */

  async create(ctx) {
    let entity;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.plugins['notification-expo'].services.exponotification.create(data, {
        files,
      });
    } else {
      entity = await strapi.plugins['notification-expo'].services.exponotification.create(
        ctx.request.body
      );
    }
    return sanitizeEntity(entity, {
      model: strapi.plugins['notification-expo'].models.exponotification,
    });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.plugins['notification-expo'].services.exponotification.update(
      { id },
      ctx.request.body
    );
    return sanitizeEntity(entity, {
      model: strapi.plugins['notification-expo'].models.exponotification,
    });
  },

  /**
   * Destroy a record.
   *
   * @return {Object}
   */

  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.plugins['notification-expo'].services.exponotification.delete({
      id,
    });
    return sanitizeEntity(entity, {
      model: strapi.plugins['notification-expo'].models.exponotification,
    });
  },
};
