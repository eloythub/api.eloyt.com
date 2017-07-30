import configs from '../../Configs'
import * as Models from '../../App/Models'


const {postgresDb} = configs

if (!process.env.NODE_ENV) {
  console.log('NODE_ENV is missing')

  process.exit(1)
}

if (process.env.NODE_ENV === 'production') {
  console.log('cannot lunch on production')

  process.exit(1)
}

(async () => {
  'use strict'

  const [, , , query] = process.argv

  try {
    console.log(`query : "${query}"`)

    await Models.sequelize.query(query)
  } catch (err) {
    console.error(err)

    process.exit(1)
  }

  process.exit(0)
})()
