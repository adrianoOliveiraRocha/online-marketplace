function editProfile() {
  try {
    let form = document.getElementById('form');
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let errors = [];

    if (email == '') {
      errors.push('Por favor, preencha o campo e-mail');
    }
    if (password == '') {
      errors.push('Por favor, preencha o campo senha');
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
      // alert('all rigth');
      form.submit();
    }
  } catch (error) {
    console.error(error);
  }  
  
}

function updateQuantidy(productId, quantity) {
  const subtotalInput = document.getElementById(`subtotal${productId}`)
  const stringPrice = document.getElementById(`price${productId}`).value
  const floatPrice = getFloatPrice(stringPrice)
  const newQuantity = getQuantity(quantity, productId)
  const newSubtotal = newQuantity * floatPrice
  subtotalInput.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newSubtotal)  
}

function getFloatPrice(stringPrice) {
  var response = stringPrice.replace('R$', '')
  response = response.replace(',', '.')
  try {
    response = parseFloat(response)
  } catch (error) {
    console.error(error)
  }
  return response
}

function getQuantity(strQuantity, productId) {
  const response = parseInt(strQuantity)
  try {    
    if (response <= 0) {
      response = 1
    }
  } catch (error) {
    console.error(`Erro: ${error}`)
    document.getElementById(`quantity${productId}`).value = 1
  }
  
  return response
}

/*
When somebody place a negative number in quantity, the system come back to 1. But, 
the calc is beeing done whit this value but positive. Pease fixe this problem
*/