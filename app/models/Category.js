class Category {
  constructor(name, image=null) {
    this.name = name;
    this.image = image;
  } 

  save(data, application, callback) {
    let stm = `insert into category(name, image) 
    values('${data.name}', '${data.image}')`;
    application.config.connect().query(stm, callback);
  }

}