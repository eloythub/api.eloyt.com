'use strict'

import debug from 'debug'
import configs from '../../Configs'
import * as Models from '../Models'
import ResourceTypesEnum from '../Enums/ResourceTypesEnum'

export default class ResourceRepository {
  static async fetchProducedVideoResourcesByLimit (offset, limit) {
    const log = debug(`${configs.debugZone}:ResourceRepository:fetchProducedVideoResourcesByLimit`)

    log('fetchProducedVideoResourcesByLimit')

    const ProducedMap = {
      'video_resource_id': 'id',
      'cloud_video_url': 'cloudVideoUrl',
      'cloud_thumbnail_url': 'cloudThumbnailUrl',
      'video_description': 'description',
      'video_hashtags': 'hashtags',
      'uploaded_at': 'uploadedAt',
      'user_info': 'videoOwner'
    }

    const resources = await Models.sequelize.query(`
      SELECT
        r.id           AS video_resource_id,
        r.uploaded_at  AS uploaded_at,
        r.cloud_url    AS cloud_video_url,
        vtr.cloud_url  AS cloud_thumbnail_url,
        vp.description AS video_description,
        (
          SELECT array_to_json(array_agg(sh)) AS hashtags
          FROM videos_hashtags AS svh
            JOIN hashtags AS sh
              ON svh.hashtag_id = sh.id
          WHERE
            svh.video_resource_id = r.id
        )              AS video_hashtags,
        (
          SELECT row_to_json(s)
          FROM (
                 SELECT
                   su.id AS id,
                   su.username AS username,
                   su.email AS email,
                   su.first_name AS firstname,
                   su.last_name AS lastname,
                   su.gender AS gender,
                   sr.cloud_url AS avatar
                 FROM users AS su
                   JOIN resources AS sr
                     ON sr.id = su.avatar_resource_id
                 WHERE
                   su.id = u.id
               ) AS s
        )              AS user_info
      FROM resources AS r
        JOIN users AS u
          ON r.user_id = u.id
        LEFT JOIN videos_thumbnails AS vt
          ON r.id = vt.video_resource_id
        LEFT JOIN resources AS vtr
          ON vtr.id = vt.thumbnail_resource_id
        JOIN videos_properties AS vp
          ON r.id = vp.video_resource_id
      WHERE
        r.type = :type
      ORDER BY
        r.uploaded_at DESC
      OFFSET :offset
      LIMIT :limit
    `, {
      replacements: {
        offset,
        limit,
        type: ResourceTypesEnum.video
      },
      fieldMap: ProducedMap,
      type: Models.sequelize.QueryTypes.SELECT
    })

    return resources
  }

  static async fetchProducedVideoResourcesByResourceId (videoResourceId) {
    const log = debug(`${configs.debugZone}:ResourceRepository:fetchProducedVideoResourcesByResourceId`)

    log('fetchProducedVideoResourcesByResourceId')

    const ProducedMap = {
      'video_resource_id': 'id',
      'cloud_video_url': 'cloudVideoUrl',
      'cloud_thumbnail_url': 'cloudThumbnailUrl',
      'video_description': 'description',
      'video_hashtags': 'hashtags',
      'uploaded_at': 'uploadedAt',
      'user_info': 'videoOwner'
    }

    const resources = await Models.sequelize.query(`
      SELECT
        r.id           AS video_resource_id,
        r.uploaded_at  AS uploaded_at,
        r.cloud_url    AS cloud_video_url,
        vtr.cloud_url  AS cloud_thumbnail_url,
        vp.description AS video_description,
        (
          SELECT array_to_json(array_agg(sh)) AS hashtags
          FROM videos_hashtags AS svh
            JOIN hashtags AS sh
              ON svh.hashtag_id = sh.id
          WHERE
            svh.video_resource_id = r.id
        )              AS video_hashtags,
        (
          SELECT row_to_json(s)
          FROM (
                 SELECT
                   su.id AS id,
                   su.username AS username,
                   su.email AS email,
                   su.first_name AS firstname,
                   su.last_name AS lastname,
                   su.gender AS gender,
                   sr.cloud_url AS avatar
                 FROM users AS su
                   JOIN resources AS sr
                     ON sr.id = su.avatar_resource_id
                 WHERE
                   su.id = u.id
               ) AS s
        )              AS user_info
      FROM resources AS r
        JOIN users AS u
          ON r.user_id = u.id
        LEFT JOIN videos_thumbnails AS vt
          ON r.id = vt.video_resource_id
        LEFT JOIN resources AS vtr
          ON vtr.id = vt.thumbnail_resource_id
        JOIN videos_properties AS vp
          ON r.id = vp.video_resource_id
      WHERE
        r.id = :videoResourceId AND
        r.type = :type
      OFFSET 0
      LIMIT 1
    `, {
      replacements: {
        videoResourceId,
        type: ResourceTypesEnum.video
      },
      fieldMap: ProducedMap,
      type: Models.sequelize.QueryTypes.SELECT
    })

    if (resources.length === 0) {
      return null
    }

    return resources[0]
  }

  static async fetchResourceById (id, type) {
    const log = debug(`${configs.debugZone}:ResourceRepository:fetchResourceById`)

    log('fetchResourceById')

    const resource = await Models.Resources.findOne({ where: { id, type } })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }

  static async fetchUserIdFromResourceById (id) {
    const log = debug(`${configs.debugZone}:ResourceRepository:fetchUserIdFromResourceById`)

    log('fetchUserIdFromResourceById')

    const resource = await Models.Resources.findOne({
      attributes: ['userId'],
      where: { id }
    })

    if (!resource) {
      return null
    }

    return resource.dataValues.userId
  }

  static async createResource (userId, type, cloudUrl, cloudFilename) {
    const log = debug(`${configs.debugZone}:UsersRepository:createResource`)

    log('createResource')

    const resource = await Models.Resources.create({ userId, type, cloudUrl, cloudFilename })

    if (!resource) {
      return null
    }

    return resource.dataValues
  }

  static async deleteResource (id) {
    const log = debug(`${configs.debugZone}:UsersRepository:deleteResource`)

    log('deleteResource')

    const resource = await Models.Resources.destroy({where: {id}})

    return resource
  }
};
