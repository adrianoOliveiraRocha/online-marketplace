function validateNewProduct() {
  try {
    const form = document.getElementById('form');
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;
    let errors = [];

    if (name == '') {
      errors.push('<strong>Por favor! preencha o campo nome</strong>');
    }

    if (description == '') {
      errors.push('<strong>Por favor! preencha o campo descrição</strong>');
    }

    price = chekPrice(price);
    if (!price) {
      errors.push('<strong>Por favor! preencha o campo preço corretamente</strong>');
    } else {
      document.getElementById('price').value = price;
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
      document.getElementById('messages').innerHTML = msgErrors;     
      
    } else {
      document.getElementById('messages').innerHTML = '';
      form.submit();
    }

  } catch (error) {
    console.error(`Oh my god! I have an error: ${error}`);
  }
}

function chekPrice(price) {
  var numericPrice = price.replace(',', '.');
  try {
    numericPrice = parseFloat(numericPrice);
    return numericPrice;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}