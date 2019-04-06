function getAmplitude(page, LIMIT) {
  const response = {}
  response.init = page * LIMIT
  response.end = response.init + LIMIT
  return response
}

function getNPages(nTuples, LIMIT) {
  let rest = nTuples % LIMIT
  if (rest == 0) {
    return nTuples/LIMIT
  } else {
    return parseInt(nTuples/LIMIT) + 1
  }
}

function paginator(collection, page) {
  /** collection must be a array of objects */
  if(typeof page === 'undefined') {
    page = 0
  } else {
    page = page - 1
  }

  const LIMIT = 3 // 8 
  let nTuples = Object.keys(collection).length
  let nPages = getNPages(nTuples, LIMIT)
  var amplitude = getAmplitude(page, LIMIT)
  var content = collection.slice(amplitude.init, amplitude.end)
  
  const response = {
    'nPages': nPages,
    'page': page + 1,
    'content': content
  }

  return response

}

module.exports = () => {
  return paginator
}