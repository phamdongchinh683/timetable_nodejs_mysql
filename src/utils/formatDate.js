function nowDate() {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const newDate = `${year}/${month}/${day}`;
  return newDate;
}

module.exports = {
  nowDate,
};
