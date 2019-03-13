class Post {

  constructor(title, text, image=null) {
    this.title = title,
    this.text = text,
    this.image = image
  }

  save(application, callback) {

    const dateFormat = require('dateformat');
    var now = new Date();
    var today = dateFormat(now, "yyyy-mm-dd");
    var stm = `insert into post (title, text, date, image) 
    values('${this.title}', '${this.text}', '${today}', '${this.image}')`;
    application.config.connect().query(stm, callback);

  }

  static getAll(application, callback) {
    var stm = "select * from blog.post";
    application.config.connect().query(stm, callback);
  }

  static get(postId, application, callback) {
    var stm = `select * from post where id = ${postId}`;
    application.config.connect().query(stm, callback);
  }

  static editPost(data, imageName, application, callback) {
    console.log(`imageName: ${imageName}`);
    var stm = null;
    if (imageName != null) { 
      stm = `update post 
      set title = '${data.title}', text = '${data.text}', 
      image = '${imageName}'
      where id = ${data.idPost}`;
    } else {
      stm = `update post 
      set title = '${data.title}', text = '${data.text}' 
      where id = ${data.idPost}`;
    }
    application.config.connect().query(stm, callback);
  }

  static deletePost(postId, application, callback) {
    var stm = `delete from post where id = ${postId}`;
    console.log(stm);
    application.config.connect().query(stm, callback);
  }
}

module.exports = () => {
  return Post;
}