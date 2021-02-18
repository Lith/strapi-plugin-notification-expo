'use strict';

module.exports = async (ctx, next) => {
  if (!ctx.state.user) {
    ctx.unauthorized('Access refused : Please be logged in.');
  }
  return await next();
};
