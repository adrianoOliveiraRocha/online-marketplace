class Product {

  constructor(data, image='null') {
    this.name = data.name.replace(/'/g, '"');
    this.description = data.description.replace(/'/g, '"');
    this.category = data.category;
    this.price = data.price;
    this.image = image;    
  }

  save(application, callback) {
    let stm = `insert into product (name, description, category, price, image) 
    values('${this.name}', '${this.description.trim()}', ${this.category}, ${this.price}, 
    '${this.image}')`;
    application.config.connect().query(stm, callback);
  }

  static getAll(application, idCategory, callback) {
    var stm = ``
    if (typeof idCategory == 'undefined') {
      stm = `select * from product`;
    } else {
      stm = `select * from product where category = ${idCategory}`;
    }

    application.config.connect().query(stm, callback);
    
  }

  static getThis(productId, application, callback) {
    let stm = `select * from product where id = '${productId}'`;
    application.config.connect().query(stm, callback); 
  }

  static edit(data, imageName, application, callback) {
    var stm = null;   
    var name = data.name.replace(/'/g, '"');
    var description = data.description.replace(/'/g, '"');
    
    if (imageName != 'null') { 
      stm = `update product 
      set name = '${name}',
      description = '${description.trim()}',
      category = ${data.category},
      price = ${data.price}, 
      image = '${imageName}'
      where id = ${data.idProduct}`;
    } else {
      stm = `update product 
      set name = '${name}',
      description = '${description.trim()}',
      category = ${data.category},
      price = ${data.price}
      where id = ${data.idProduct}`;
    }
    application.config.connect().query(stm, callback);
  }

  static delete(idProduct, application, callback) {
    const stm = `delete from product where id = ${idProduct}`;
    application.config.connect().query(stm, callback);
  }

  static getName(productId, application, callback) {
    let stm = `
    select name from product
    where id = ${productId}`
    application.config.connect().query(stm, callback)
  }
  
}

module.exports = () => {
  return Product;
}