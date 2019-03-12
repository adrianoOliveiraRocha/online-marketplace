function deleteOldeImage(Post, data, application) {
  Post.get(data.idPost, application, (err, result) => {
    if (err) {
      console.error(err.sqlMessage);
      res.send(`Oops! error getting image name of the database. Please contact the developer!`);
    } else {
      if (Object.keys(result).length == 0) {
        console.log(`No image to delete`);
      } else {
        let oldFile = __dirname + `/../public/upload/${result[0].image}`;
        const fs = require('fs');
        fs.unlink(oldFile, (errOldFile) => {
          if (errOldFile) {
            console.log(`Error trying delete the file: ${errOldFile}`);
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
      return null;
    }
  });
  return imageName;
}

module.exports.deleteOldeImage = deleteOldeImage;
module.exports.uploadImage = uploadImage;