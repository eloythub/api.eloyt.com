'use strict'

import url from 'url'
import debug from 'debug'
import RequestService from './RequestService'
import configs from '../../Configs'
import RequestEnum from '../Enums/RequestEnum'

export default class ComService extends RequestService {
  static baseUrl = configs.comServiceBaseUrl

  static directMessageToUser (senderUserId, receiverUserId, messageObject) {
    const log = debug(`${configs.debugZone}:ComService`)

    log('directMessageToUser')

    const response = this.dispatchRequest(
      RequestEnum.post,
      url.resolve(this.baseUrl, '/messages/send'),
      {
        senderUserId,
        receiverUserId,
        messageObject
      }
    )

    return response
  }

  static reactLikeToUserSnap (senderUserId, receiverUserId, resourceId) {
    const log = debug(`${configs.debugZone}:ComService`)

    log('reactToUserSnap', senderUserId, receiverUserId, resourceId)

    const response = this.dispatchRequest(
      RequestEnum.post,
      url.resolve(this.baseUrl, '/stream/react/like'),
      {
        senderUserId,
        receiverUserId,
        resourceId
      }
    )

    return response
  }
};
