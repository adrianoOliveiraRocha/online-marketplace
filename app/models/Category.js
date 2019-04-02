class Category {
  
  constructor(name) {
    this.name = name.replace(/'/g, '"');    
  } 

  save(application, callback) {
    let stm = `insert into category(name) 
    values('${this.name}')`;
    application.config.connect().query(stm, callback);
  }

  static getAll(application, callback) {
    let stm = `select * from category`;
    application.config.connect().query(stm, callback);
  }

  static getThis(categoryId, application, callback) {
    let stm = `select * from category where id = ${categoryId}`;
    application.config.connect().query(stm, callback);
  }

  static edit(data, application, callback) {
    var stm = null;
    var name = data.name.replace(/'/g, '"'); // it replaces all ocurrences
    stm = `update category 
    set name = '${name}' 
    where id = ${data.categoryId}`;
    application.config.connect().query(stm, callback);
  }

  static delete(categoryId, application, callback) {
    const stm = `delete from category where id = ${categoryId}`;
    application.config.connect().query(stm, callback);
  }

  static doesHasProductAttached(categoryId, application, callback) {
    const stm = `select id from product where category = ${categoryId}`;
    application.config.connect().query(stm, callback);
  }

}

module.exports = () => {
  return Category;
}