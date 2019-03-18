class Product {

  constructor(name, description, category, image=null) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.image = image;    
  }

  save(application, callback) {

    var stm = `insert into product (name, description, category, image) 
    values('${this.name}', '${this.description}', ${this.category}, '${this.image}')`;
    application.config.connect().query(stm, callback);
  }
  
}

module.exports = () => {
  return Product;
}