'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
  /**
   * Promise to fetch all records
   *
   * @return {Promise}
   */

  find(params, populate) {
    return strapi.query('expotoken', 'notification-expo').find(params, populate);
  },

  /**
   * Promise to fetch record
   *
   * @return {Promise}
   */

  findOne(params, populate) {
    // Select field to populate.
    return strapi.query('expotoken', 'notification-expo').findOne(params, populate);
  },

  /**
   * Promise to count record
   *
   * @return {Promise}
   */

  count: (params) => {
    return strapi.query('expotoken', 'notification-expo').count(params);
  },

  /**
   * Promise to add record
   *
   * @return {Promise}
   */
  async create(data) {
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.plugins['notification-expo'].models.expotoken,
      data,
      { isDraft }
    );

    return strapi.query('expotoken', 'notification-expo').create(validData);
  },

  /**
   * Promise to edit record
   *
   * @return {Promise}
   */
  async update(params, data) {
    const existingEntry = await strapi.query('expotoken', 'notification-expo').findOne(params);

    const isDraft = isDraft(existingEntry, strapi.plugins['notification-expo'].models.expotoken);
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.plugins['notification-expo'].models.expotoken,
      data,
      { isDraft }
    );

    return strapi.query('expotoken', 'notification-expo').update(params, validData);
  },

  /**
   * Promise to delete a record
   *
   * @return {Promise}
   */

  delete(params) {
    return strapi.query('expotoken', 'notification-expo').delete(params);
  },

  /**
   * Promise to search records
   *
   * @return {Promise}
   */

  search(params) {
    return strapi.query('expotoken', 'notification-expo').search(params);
  },

  /**
   * Promise to count expo token
   *
   * @return {Promise}
   */

  countSearch(params) {
    return strapi.query('expotoken', 'notification-expo').countSearch(params);
  },
};
