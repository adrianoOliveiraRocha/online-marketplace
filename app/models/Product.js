class Product {

  constructor(data, image=null) {
    this.name = data.name;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.image = image;    
  }

  save(application, callback) {
    var stm = `insert into product (name, description, category, price, image) 
    values('${this.name}', '${this.description}', ${this.category}, ${this.price}, 
    '${this.image}')`;
    application.config.connect().query(stm, callback);
  }

  static getAll(application, callback) {
    let stm = `select * from product`;
    application.config.connect().query(stm, callback);
  }
  
}

module.exports = () => {
  return Product;
}