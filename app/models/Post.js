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
    var stm = `insert into post (title, text, image) 
    values('${this.title}', '${this.text}', '${this.image}')`;
    application.config.connect().query(stm, callback);
  }

}

module.exports = () => {
  return Post;
}