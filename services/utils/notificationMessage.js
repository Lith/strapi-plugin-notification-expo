'use strict';

const { Expo } = require('expo-server-sdk');

module.exports = {
  async send(params, pushTokens) {
    const expo = new Expo();
    const messages = [];

    pushTokens.map((pushToken) => {
      if (!Expo.isExpoPushToken(pushToken)) {
        strapi.log.fatal(
          '[EXPO][ERROR] ' + `Push token ${pushToken} is not a valid Expo push token`
        );
        return false;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: params.title,
        body: params.body,
        data: params.data ? params.data : params.data_url ? { url: params.data_url } : {},
      });
    });

    if (!messages.length) {
      return false;
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    await (async () => {
      chunks.map(async (chunk) => {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          strapi.log.fatal('[EXPO][ERROR] ' + error);
        }
      });
    })();

    const receiptIds = [];
    tickets.map((ticket) => {
      if (ticket.id) {
        receiptIds.push(ticket.id);
      }
    });

    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    await (async () => {
      receiptIdChunks.map(async (chunk) => {
        try {
          const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          receipts.map((receipt) => {
            if (receipt.status === 'error') {
              strapi.log.fatal(`There was an error sending a notification: ${receipt.message}`);
              if (receipt.details && receipt.details.error) {
                strapi.log.fatal(`The error code is ${receipt.details.error}`);
              }
            }
          });
        } catch (error) {
          strapi.log.fatal('[EXPO][ERROR] ' + error);
        }
      });

      return true;
    })();
  },
};
