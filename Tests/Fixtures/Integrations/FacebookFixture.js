'use strict'

export default class FacebookFixture {
  static mockedFacebookAccessToken = 'EAAPgjOUgXA0BAANBdSphTamZC7Ej1D2X47AKvlvR5ZBsFmJY0MH7wBRY9WeZABCBFoJT8InatfA5gxopCx0NnnGDIkizdeRs7ifNYPgtjXaf4UMhP60tx80aozvpZAx0cOynsyPZAgN1TeIaXQ9nFwbFi3iCpXHzoOlf5kPUlh9ZCpMP5e8hTWDgr2WwIG3ooZD'

  static mockedFacebookProfile = {
    id: '1229478130430248',
    email: 'test@eloyt.com',
    name: 'John Doe',
    gender: 'male',
    first_name: 'John',
    last_name: 'Doe',
    birthday: '08/09/1992'
  }

  static mockedFacebookPicture = {
    data: {
      height: 959,
      is_silhouette: false,
      url: 'https://z-m-scontent.xx.fbcdn.net/v/t1.0-1/18446841_1504120496299342_7868434953193313882_n.jpg?_nc_ad=z-m&oh=5aafc64a7bd8cd92a9c86263f8e5ac97&oe=59F96B40',
      width: 959
    }
  }
}
