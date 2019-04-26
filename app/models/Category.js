class Category {
  
  constructor(name) {
    this.name = name.replace(/'/g, '"');    
  } 

  save(connect, callback) {
    let stm = `insert into category(name) 
    values('${this.name}')`;
    connect.query(stm, callback);
  }

  static getAll(connect, callback) {
    let stm = `select * from category`;
    connect.query(stm, callback);
  }

  static getThis(categoryId, connect, callback) {
    let stm = `select * from category where id = ${categoryId}`;
    connect.query(stm, callback);
  }

  static edit(data, connect, callback) {
    var stm = null;
    var name = data.name.replace(/'/g, '"'); // it replaces all ocurrences
    stm = `update category 
    set name = '${name}' 
    where id = ${data.categoryId}`;
    connect.query(stm, callback);
  }

  static delete(categoryId, connect, callback) {
    const stm = `delete from category where id = ${categoryId}`;
    connect.query(stm, callback);
  }

  static doesHasProductAttached(categoryId, connect, callback) {
    const stm = `select id from product where category = ${categoryId}`;
    connect.query(stm, callback);
  }

}

module.exports = () => {
  return Category;
}