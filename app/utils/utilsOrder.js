function fixDate(date) {
  let day = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function fixHour(date) {
  let hh = date.getHours()
  let mm = date.getMinutes()
  let ss = date.getSeconds()
  return `${hh}:${mm}:${ss}`
}

function getRest(money, total) {
  return money - total
}

module.exports.fixDate = fixDate
module.exports.fixHour = fixHour
module.exports.getRest = getRest
