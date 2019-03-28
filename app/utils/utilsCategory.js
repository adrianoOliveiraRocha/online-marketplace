function deleteOldeImage(Category, categoryId, application) {
  Category.getThis(categoryId, application, (err, result) => {
    if (err) {
      console.error(`Error trying get category to delete old image: ${err}`);
      throw new Error(err);
    } else {
      if (Object.keys(result).length == 0) {
        console.log(`No image to delete: ${result[0]}`);
      } else {
        let oldFile = __dirname + `/../public/upload/${result[0].image}`;
        const fs = require('fs');
        fs.unlink(oldFile, (errOldFile) => {
          if (errOldFile) {
            console.log(`Error trying delete the file: ${errOldFile}`);
            throw new Error(err);
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
      console.error(err);
      throw new Error(`Error trying upload image: ${err}`);
    }
  });
  return imageName;
}

module.exports.deleteOldeImage = deleteOldeImage;
module.exports.uploadImage = uploadImage;
