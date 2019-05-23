const EditableInformation = (function() {
  return {
    saveAboutUs: function(data) {
      const fs = require('fs')
      let aboutUs = {
        "type": "aboutUs",
        "data": data
      }
      let dataStringfy = JSON.stringify(aboutUs)
      let path = __dirname + '/../public/json-files/about-us.json'
      fs.writeFileSync(path, dataStringfy)
    }
  }
})()

module.exports = EditableInformation
