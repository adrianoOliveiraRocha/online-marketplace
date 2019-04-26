class Product {

  constructor(data, image='null') {
    this.name = data.name.replace(/'/g, '"');
    this.description = data.description.replace(/'/g, '"');
    this.category = data.category;
    this.price = data.price;
    this.image = image;    
  }

  save(connect, callback) {
    let stm = `insert into product (name, description, category, price, image) 
    values('${this.name}', '${this.description.trim()}', ${this.category}, ${this.price}, 
    '${this.image}')`;
    connect.query(stm, callback);
  }

  static getAll(connect, idCategory, callback) {
    var stm = ``
    if (typeof idCategory == 'undefined') {
      stm = `select * from product`;
    } else {
      stm = `select * from product where category = ${idCategory}`;
    }

    connect.query(stm, callback);
    
  }

  static showProducts(connect, callback) {
    // This method get take all products to show in the admin
    var stm = `select * from product`    
    connect.query(stm, callback);    
  }

  static getThis(productId, connect, callback) {
    let stm = `select * from product where id = '${productId}'`;
    connect.query(stm, callback); 
  }

  static edit(data, imageName, connect, callback) {
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
    connect.query(stm, callback);
  }

  static delete(idProduct, connect, callback) {
    const stm = `delete from product where id = ${idProduct}`;
    connect.query(stm, callback);
  }

  static getName(productId, connect, callback) {
    let stm = `
    select name from product
    where id = ${productId}`
    connect.query(stm, callback)
  }
  
}

module.exports = () => {
  return Product;
}