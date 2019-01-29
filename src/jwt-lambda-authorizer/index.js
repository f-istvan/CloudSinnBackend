const auth = require('./auth');
let data;

module.exports.handler = async (event) => {
  console.log('allatok')
  console.log(event)
  try {
    data = await auth.authenticate(event);
  }
  catch (err) {
      console.log(err);
      return `Unauthorized: ${err.message}`;
  }
  return data;
};
