module.exports = {

  parseResponse: function (response, callback) {

    var data = '';

    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      //console.log('    response data: ' + data);
      if (response.statusCode < 300) {
        callback(null, { statusCode: response.statusCode, data: data, responseObject: data && JSON.parse(data)} );
      } else {
        callback(data);
      }
    });

  }

};