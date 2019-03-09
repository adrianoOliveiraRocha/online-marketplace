function test() {
  try {
    const form = document.getElementById('form');
    const title = document.getElementById('title').value;
    const text = CKEDITOR.instances.ckeditor_full.getData();
    if (text == '' || title == '') {
      console.log('please, insert an text and a title to your post!');
    } else {
      console.log('Wow! now I can send my formulary');
    }
  } catch (error) {
    console.error(`Oh my god! I have an error: ${error}`);
  }
}