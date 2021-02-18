'use strict';

module.exports = {
  async get(data) {
    /**
     * Retrieve all users by platform selected
     */
    const { platform } = data;
    const users = [];
    await strapi
      .query('expotoken', 'notification-expo')
      .model.query((qb) => {
        if (platform === 'ios' || platform === 'android') {
          qb.select('user').where('platform', platform);
        } else {
          qb.select('user');
        }
      })
      .fetchAll({
        withRelated: [],
      })
      .then((response) => {
        response.toJSON().map((item) => {
          users.push(item.user);
        });
      })
      .catch((e) => {
        strapi.log.fatal(e);
      });

    return users;
  },
};
