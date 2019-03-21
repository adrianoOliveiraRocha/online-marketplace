class Product {

  constructor(data, image=null) {
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.image = image;    
  }

  save(application, callback) {
    let stm = `insert into product (name, description, category, price, image) 
    values('${this.name}', '${this.description}', ${this.category}, ${this.price}, 
    '${this.image}')`;
    application.config.connect().query(stm, callback);
  }

  static getAll(application, callback) {
    let stm = `select * from product`;
    application.config.connect().query(stm, callback);
  }

  static getThis(productId, application, callback) {
    let stm = `select * from product where id = '${productId}'`;
    application.config.connect().query(stm, callback); 
  }

  static edit(data, imageName, application, callback) {
    var stm = null;
    if (imageName != null) { 
      stm = `update product 
      set name = '${data.name}', 
      image = '${imageName}'
      where id = ${data.categoryId}`;
    } else {
      stm = `update category 
      set name = '${data.name}' 
      where id = ${data.categoryId}`;
    }
    application.config.connect().query(stm, callback);
  }
  
}

module.exports = () => {
  return Product;
}