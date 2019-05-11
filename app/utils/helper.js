function deleteOldeImage(Class, objectId, folder, connect) {
  Class.getThis(objectId, connect, (err, result) => {
    connect.end()
    if (err) {
      throw new Error(`Error trying get the object (${Class}) to delete old image: ${err}`);
    } else {

      try {
        if (result[0].image == 'null') {
          console.log(`No image to delete`);
          console.log(result[0]);
        } else {
          let oldFile = __dirname + `/../public/upload/${folder}/${result[0].image}`;
          const fs = require('fs');
          fs.unlink(oldFile, (errOldFile) => {
            if (errOldFile) {
              console.error(`Error trying delete old image of the object ${err}`);
            } else {
              console.log('Image deleted with success!');
            }
          });
        }
      } catch (error) {
        console.log('This error happen probably because for any \
        reason this object had not a image attached in');
        console.error(error);
      }

    }
  })
}

function deleteProductImage(imageName) {
  const fs = require('fs')
  let oldImage = __dirname + `/../public/upload/product/${imageName}`
  fs.unlink(oldImage, (errOldImage) => {
    if (errOldImage) {
      console.error(`Error trying delete old image: ${errOldImage}`)
    }
  })
}

function uploadImage(image, folder) {
  let prefix = new Date().getTime() + '_';
  var imageName = prefix + image.name;
  image.mv(__dirname + `/../public/upload/${folder}/${imageName}`, (err) => {
    if (err) {
      throw new Error(`Error trying upload image: ${err}`);
    }
  });
  return imageName;
}

function getTotal(cart){
  if(typeof cart != 'undefined') {// I have a shoping cart
    var response = 0
    cart.forEach(product => {
      if(product != null) {
        response += parseFloat(product.subTotal)
      }
    })
    return response
  } else {
    return undefined
  }
}


module.exports.deleteOldeImage = deleteOldeImage
module.exports.uploadImage = uploadImage
module.exports.getTotal = getTotal
module.exports.deleteProductImage = deleteProductImage
