function deleteOldeImage(Class, objectId, application) {
  Class.getThis(objectId, application, (err, result) => {
    if (err) {
      throw new Error(`Error trying get the object (${Class}) to delete old image: ${err}`);
    } else {
      if (result[0].image == 'null') {
        console.log(`No image to delete`);
        console.log(result[0]);
      } else {
        let oldFile = __dirname + `/../public/upload/${result[0].image}`;
        const fs = require('fs');
        fs.unlink(oldFile, (errOldFile) => {
          if (errOldFile) {
            throw new Error(`Error trying delete old image of the object (${Class}): ${err}`);
          } else {
            console.error('Image deleted with success!');
          }
        }); 
      }
    }
  });
}

function uploadImage(image) {
  let prefix = new Date().getTime() + '_';
  var imageName = prefix + image.name;
  image.mv(__dirname + '/../public/upload/' + imageName, (err) => {
    if (err) {
      throw new Error(`Error trying upload image: ${err}`);
    }
  });
  return imageName;
}

module.exports.deleteOldeImage = deleteOldeImage;
module.exports.uploadImage = uploadImage;
