module.exports = {
  origin: process.env.FRONTEND_URL,
  origin: function (origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

