function responseStatus(res, statusCode, status, data) {
  if (status === "success") {
    return res.status(statusCode).json({
      status: status,
      data: data,
    });
  } else {
    return res.status(statusCode).json({
      status: status,
      message: data,
    });
  }
}

function responseStatusSocket(io, listen, status, data) {
  if (status === "success") {
    io.emit(`${listen}`, {
      status: status,
      data: data,
    });
  } else {
    io.emit(`${listen}`, {
      status: status,
      data: data,
    });
  }
}

module.exports = { responseStatus, responseStatusSocket };
