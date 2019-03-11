class Post {

  constructor(title, text, image=null) {
    this.title = title,
    this.text = text,
    this.image = image
  }

  getTitle() {
    return this.title;
  }

  getText() {
    return this.text;
  }

  save(application, callback) {

    const dateFormat = require('dateformat');
    var now = new Date();
    var today = dateFormat(now, "yyyy-mm-dd"); 
    
    var stm = `insert into post (title, text, date, image) 
    values('${this.title}', '${this.text}', '${today}', '${this.image}')`;
    console.log(stm);

    application.config.connect().query(stm, callback);

  }

  static getAll(application, callback) {
    var stm = "select * from blog.post";
    application.config.connect().query(stm, callback);
  }

  static get(idPost, application, callback) {
    var stm = `select * from post where id = ${idPost}`;
    application.config.connect().query(stm, callback);
  }

  static editPost(data, application, callback) {
    let stm = `update post 
    set title = '${data.title}', text = '${data.text}' 
    where id = ${data.idPost}`;
    console.log(stm);
    application.config.connect().query(stm, callback);
  }

}

module.exports = () => {
  return Post;
}