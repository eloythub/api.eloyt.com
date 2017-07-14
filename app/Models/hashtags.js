'use strict'

export default function (sequelize, DataTypes) {
  return sequelize.define('Hashtags', {
    id: {
      field: 'id',
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    slug: {
      field: 'slug',
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      field: 'name',
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'hashtags',
    timestamps: false,
    underscored: true
  })
}
