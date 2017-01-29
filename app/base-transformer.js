'use strict';

const DataTransform = require("node-json-transform").DataTransform;

module.exports = class BaseTransformer {
  resourceUri(userId, resourceType, resourceId) {
    return `/stream/${userId}/${resourceType}/${resourceId}`;
  }

  resourceThumbnailUri(userId, resourceType, resourceId, imageSize) {
    return `/stream/${userId}/${resourceType}/${resourceId}/thumbnail/${imageSize}`;
  }

  transform(data, map) {
    return DataTransform(data, map).transform();
  }
};
