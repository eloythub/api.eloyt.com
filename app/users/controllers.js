'use strict';

module.exports = class Controllers {
  createOrGet(req, res) {
    console.log(req.payload);

    res({
      statusCode: 200,
      error: '',
    });
  }
}
