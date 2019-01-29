module.exports.handler = function(event, context, callback) {

  response = {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(
        {
            "message": "Hello World!"
        }
    )
  }

  callback(null, response);
};


