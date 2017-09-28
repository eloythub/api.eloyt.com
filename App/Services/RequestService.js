'use strict'

import debug from 'debug'
import configs from '../../Configs'
import request from 'request-promise'
import RequestEnum from '../Enums/RequestEnum'

export default class RequestService {
  static dispatchRequest (method, uri, data, headers = {}) {
    const log = debug(`${configs.debugZone}:RequestService:dispatchRequest`)

    log('dispatchRequest')

    let options = {
      method,
      uri,
      headers,
      json: true
    }

    if (method === RequestEnum.get) {
      options = Object.assign({
        qs: data,
      }, options)
    } else {
      options = Object.assign({
        body: data,
      }, options)
    }

    return request(options)
  }
};
