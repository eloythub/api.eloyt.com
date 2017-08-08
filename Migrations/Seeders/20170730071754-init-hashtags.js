'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('hashtags', [
      { id: '90035d58-bf3d-4de9-83b5-62761bb567b4', slug: 'oilandgas', name: 'Oil & Gas' },
      { id: '8ed3bd2a-beab-44b8-aefd-c6a5ca24a234', slug: 'basicmaterials', name: 'Basic Materials' },
      { id: '56e419eb-9f92-4766-94c3-950014a5b411', slug: 'industrials', name: 'Industrials' },
      { id: 'c08188b2-c08e-4202-81cf-2df5ad150984', slug: 'consumergoods', name: 'Consumer Goods' },
      { id: '42af92cc-5a46-4311-b280-b345b03bb11e', slug: 'healthcare', name: 'Healthcare' },
      { id: '642bb443-b4fe-44c3-a784-561b79018ede', slug: 'consumerservices', name: 'Consumer Services' },
      { id: 'a1d8b65e-050f-47bb-8ca2-9dbd080d8e16', slug: 'telecommunications', name: 'Telecommunications' },
      { id: 'e1d3f57a-91a3-479e-b8fc-48797bb00f17', slug: 'utilities', name: 'Utilities' },
      { id: 'ff982ab9-43f7-4e63-86b5-b4a328154b50', slug: 'financials', name: 'Financials' },
      { id: '07c6801d-cf58-49c8-95dc-5f341f0c9963', slug: 'technology', name: 'Technology' },
      { id: '6d80cd42-a0a8-42b2-9641-c070139698e6', slug: 'foods', name: 'Foods' },
      { id: '41c9b260-6bbb-49ce-8311-64f2dea0e2a3', slug: 'mobileapps', name: 'Mobile Apps' }
    ])
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('hashtags', {
      where: {
        id: [
          '90035d58-bf3d-4de9-83b5-62761bb567b4',
          '8ed3bd2a-beab-44b8-aefd-c6a5ca24a234',
          '56e419eb-9f92-4766-94c3-950014a5b411',
          'c08188b2-c08e-4202-81cf-2df5ad150984',
          '42af92cc-5a46-4311-b280-b345b03bb11e',
          '642bb443-b4fe-44c3-a784-561b79018ede',
          'a1d8b65e-050f-47bb-8ca2-9dbd080d8e16',
          'e1d3f57a-91a3-479e-b8fc-48797bb00f17',
          'ff982ab9-43f7-4e63-86b5-b4a328154b50',
          '07c6801d-cf58-49c8-95dc-5f341f0c9963',
          '6d80cd42-a0a8-42b2-9641-c070139698e6',
          '41c9b260-6bbb-49ce-8311-64f2dea0e2a3'
        ]
      }
    })
  }
}













