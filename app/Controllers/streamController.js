'use strict'

import debug from 'debug'
import configs from '../../Configs'
import StreamService from '../Services/StreamService'

export default class StreamController {
  static async videoUploadHandle (req, res) {
    const error = debug(`${configs.debugZone}:StreamController:videoUploadHandle`)

    const { user } = req.auth.credentials
    const { file: uploadFile, description, hashtags: implodedHashtags } = req.payload

    // Validate the File
    if (!uploadFile) {
      return res({
        statusCode: 400,
        message: 'No file uploaded.'
      }).code(400)
    }

    // Validate the Interests
    const hashtags = implodedHashtags.split(',')

    if (!(hashtags.length >= 1 && hashtags.length <= 3)) {
      return res({
        statusCode: 400,
        message: `hashtags must be in range of 1 to 3. ${hashtags.length} inserted.`
      }).code(400)
    }

    try {
      const videoResource = await StreamService.uploadVideoResource(user.id, uploadFile, description, hashtags)

      // Create Thumbnail
      await StreamService.getVideoThumbnailResource(videoResource.id)

      res({
        statusCode: 200,
        data: videoResource
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }

  static async streamResourceReact (req, res) {
    const error = debug(`${configs.debugZone}:StreamController:streamResourceReact`)

    const { user } = req.auth.credentials
    const { resourceId, reactType } = req.payload

    try {
      const { data, action } = await StreamService.reactToResource(user.id, resourceId, reactType)

      res({
        statusCode: 200,
        data,
        action
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }

  static async streamThumbnailResource (req, res) {
    const error = debug(`${configs.debugZone}:StreamController:streamThumbnailResource`)

    const { videoResourceId } = req.params

    try {
      const { data, action } = await StreamService.getVideoThumbnailResource(videoResourceId)

      res({
        statusCode: 200,
        data,
        action
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }

  static async produceStreamResources (req, res) {
    const error = debug(`${configs.debugZone}:StreamController:produceStreamResources`)

    const { offset, limit } = req.query

    try {
      // TODO: at this moment it loads all datas from all the users and have to refactor to work with location radius
      const data = await StreamService.produceStreamResource(offset, limit)

      res({
        statusCode: 200,
        data
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }

  static async produceOneStreamResourceById (req, res) {
    const error = debug(`${configs.debugZone}:StreamController:produceStreamResources`)

    const {videoResourceId} = req.params

    try {
      const data = await StreamService.produceStreamResourceById(videoResourceId)

      res({
        statusCode: 200,
        data
      }).code(200)
    } catch (e) {
      error(e.message)

      res({
        statusCode: 500,
        error: e.message
      }).code(500)
    }
  }
};
