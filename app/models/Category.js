class Category {
  
  constructor(name, image=null) {
    this.name = name;
    this.image = image;
  } 

  save(application, callback) {
    let stm = `insert into category(name, image) 
    values('${this.name}', '${this.image}')`;
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

  static edit(data, imageName, application, callback) {
    var stm = null;
    if (imageName != null) { 
      stm = `update category 
      set name = '${data.name}', 
      image = '${imageName}'
      where id = ${data.categoryId}`;
    } else {
      stm = `update category 
      set name = '${data.name}' 
      where id = ${data.categoryId}`;
    }
    console.log(stm);
    application.config.connect().query(stm, callback);
  }

  static delete(categoryId, application, callback) {
    const stm = `delete from category where id = ${categoryId}`;
    application.config.connect().query(stm, callback);
  }

}


module.exports = () => {
  return Category;
}