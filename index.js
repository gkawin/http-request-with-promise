var http = require('https')

const p = (host, path) => new Promise((resolve, reject) => {
  const request = http.request({
    host,
    path,
    port: 443,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (res) => {
    res.setEncoding('utf8')
    res.setTimeout(10000)
    if (res.statusCode === 404) { reject('server not found') }

    var data = []
    res.on('error', (e) => {
      reject('problem with request: ' + e.message)
    })
    .on('data', (chunk) => {
      data.push(chunk)
    }).on('end', (e) => {
      if (data.length > 1) {
        const concatBuffData = Buffer.concat(data).toString()
        resolve(concatBuffData)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })

  request.on('error', function (e) {
    reject('problem with request: ' + e.message)
  })
  request.write('data\n')
  request.end()
})
