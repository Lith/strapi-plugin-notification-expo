'use strict';

const _ = require('lodash');
const cron = require('node-schedule');

module.exports = (strapi) => {
  return {
    initialize() {
      const scheduleTask = (taskExpression, taskValue) => {
        // tricks for end of object with __filename__
        if (taskExpression === '__filename__') return;

        if (_.isFunction(taskValue)) {
          return cron.scheduleJob(taskExpression, taskValue);
        }

        const options = _.get(taskValue, 'options', {});

        cron.scheduleJob(
          {
            rule: taskExpression,
            ...options,
          },
          taskValue.task
        );
      };

      _.forEach(_.keys(strapi.plugins), (pluginName) => {
        if (
          strapi.plugins[pluginName].config &&
          strapi.plugins[pluginName].config.functions &&
          strapi.plugins[pluginName].config.functions.cron
        ) {
          const pluginCron = strapi.plugins[pluginName].config.functions.cron;
          if (pluginCron) {
            _.forEach(_.entries(pluginCron), ([taskExpression, taskValue]) => {
              scheduleTask(taskExpression, taskValue);
            });
          }
        }
      });
    },
  };
};
