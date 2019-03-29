function validateNewCategory() {
  
  try {
    const form = document.getElementById('form');
    const name = document.getElementById('name').value;
    let errors = [];

    if (name == '') {
      errors.push('<strong>Por favor! preencha o campo nome</strong>');
    }

    if (Object.keys(errors).length > 0) {
      var msgErrors = '';
      errors.forEach((message) => {
        msgErrors += `
        <div class="alert alert-warning"  role="alert">
          ${message}
        </div>
        `;
      });
      console.log(name);
      document.getElementById('messages').innerHTML = msgErrors;     
      
    } else {
      document.getElementById('messages').innerHTML = '';
      form.submit();
    }

  } catch (error) {
    console.error(`Oh my god! I have an error: ${error}`);
  }
}

function deleCategory() {
  const categoryId = document.getElementById('categoryId').value;
  location.href = "/delete_category?categoryId=" + categoryId;
}





