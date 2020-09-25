'use strict';

/**
 * Expo.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const {Expo} = require('expo-server-sdk');

module.exports = {

  send: async (ctx, params) => {

    let expo = new Expo();

    // @infos - change this part by your own user table
    const pushTokens = await strapi.services.expotoken.find({user_id: params.id});

    let messages = [];
    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken.token)) {
        strapi.log.fatal('[EXPO][ERROR] ' + `Push token ${pushToken.token} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken.token,
        title: params.title,
        body: params.body,
        data: params.data,
        priority: 'high',
        //channelId: params.channelId ? params.channelId : 'default'
      });
    }

    if (!messages.length) {
      return;
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          strapi.log.fatal('[EXPO][ERROR] ' + error);
        }
      }
    })();

    /**
     * Todo - manage receipts
     */
    let receiptIds = [];
    for (let ticket of tickets) {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          for (let receipt of receipts) {
            if (receipt.status === 'error') {
              strapi.log.fatal(`There was an error sending a notification: ${receipt.message}`);
              if (receipt.details && receipt.details.error) {
                strapi.log.fatal(`The error code is ${receipt.details.error}`);
              }
            }
          }
        } catch (error) {
          strapi.log.fatal('[EXPO][ERROR] ' + error);
        }
      }
    })();
  }

};
