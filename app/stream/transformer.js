'use strict';

const BaseTransformer = require('../base-transformer');

module.exports = class StreamTransformer extends BaseTransformer {
  produceStreamResources(data) {
    let map = {
      item: {
        metaData: '_id', // temporary meta data
        id: '_id._id',
        resourceUri: '',
        resourceThumbnailUri: '',
        user: {
          metaData: 'userId', // temporary meta data
          id: 'userId._id',
          firstName: 'userId.firstName',
          avatarUri: '',
        },
        statistics: {
          count: {
            thumbsUp: '_id.thumbsUpCount',
            thumbsDown: '_id.thumbsDownCount',
            views: '_id.viewsCount',
          }
        },
      },
      each: (item) => {
        item.resourceUri = this.resourceUri(
          item.metaData.userId,
          item.metaData.resourceType,
          item.metaData._id
        );

        item.resourceThumbnailUri = this.resourceThumbnailUri(
          item.metaData.userId,
          item.metaData.resourceType,
          item.metaData._id,
          'original'
        );

        item.user.avatarUri = this.resourceUri(
          item.user.metaData.avatar.userId,
          item.user.metaData.avatar.resourceType,
          item.user.metaData.avatar._id
        );

        delete item['metaData'];
        delete item.user['metaData'];

        return item;
      }
    };

    return this.transform(data, map);
  }
};
