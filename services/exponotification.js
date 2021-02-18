'use strict';

const { contentTypes: contentTypesUtils } = require('strapi-utils');
const usersByPlatform = require('./utils/usersByPlatform');

module.exports = {
  /**
   * Promise to fetch all records
   *
   * @return {Promise}
   */

  find(params, populate) {
    return strapi.query('exponotification', 'notification-expo').find(params, populate);
  },

  /**
   * Find many records (paginated)
   *
   * @returns {Promise<user>}
   */

  async findPage(params) {
    return strapi.query('exponotification', 'notification-expo').findPage(params);
  },

  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */

  findOne(params, populate) {
    // Select field to populate.
    return strapi.query('exponotification', 'notification-expo').findOne(params, populate);
  },

  /**
   * Promise to count record
   *
   * @return {Promise}
   */

  count: (params) => {
    return strapi.query('exponotification', 'notification-expo').count(params);
  },

  /**
   * Promise to add a/an notification.
   *
   * @return {Promise}
   */

  async create(data) {
    const isDraft = contentTypesUtils.isDraft(
      data,
      strapi.plugins['notification-expo'].models.exponotification
    );

    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.plugins['notification-expo'].models.exponotification,
      data,
      { isDraft }
    );

    const users = await usersByPlatform.get(data);
    return strapi
      .query('exponotification', 'notification-expo')
      .create({ ...validData, users, total: users.length });
  },

  /**
   * Promise to edit record
   *
   * @return {Promise}
   */

  async update(params, data) {
    const existingEntry = await strapi
      .query('exponotification', 'notification-expo')
      .findOne(params);

    const isDraft = contentTypesUtils.isDraft(
      existingEntry,
      strapi.plugins['notification-expo'].models.exponotification
    );

    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.plugins['notification-expo'].models.exponotification,
      data,
      { isDraft }
    );

    const users = await usersByPlatform.get(data);
    return strapi
      .query('exponotification', 'notification-expo')
      .update(params, { ...validData, users, total: users.length });
  },

  /**
   * Promise to delete a record
   *
   * @return {Promise}
   */

  delete(params) {
    return strapi.query('exponotification', 'notification-expo').delete(params);
  },

  /**
   * Promise to search records
   *
   * @return {Promise}
   */

  search(params) {
    return strapi.query('exponotification', 'notification-expo').search(params);
  },

  /**
   * Search many records (paginated)
   *
   * @returns {Promise<user>}
   */

  async searchPage(params) {
    return strapi.query('exponotification', 'notification-expo').searchPage(params);
  },

  /**
   * Promise to count searched records
   *
   * @return {Promise}
   */

  countSearch(params) {
    return strapi.query('exponotification', 'notification-expo').countSearch(params);
  },
};
