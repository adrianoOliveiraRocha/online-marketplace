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
  const stringStock = document.getElementById(`stock${productId}`).value
  const floatPrice = getFloatPrice(stringPrice)
  const intStock = getIntStock(stringStock)
  const newQuantity = getQuantity(quantity, productId, intStock)
  const newSubtotal = newQuantity * floatPrice
  subtotalInput.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newSubtotal)  
  const newTotal = updateTotal()
  console.log(document.getElementById('total'))
  document.getElementById('total').value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newTotal)
}

function getIntStock(stringStock) {
  var response = stringStock.replace('R$', '')
  response = response.replace(',', '.')
  try {
    response = parseInt(response)
  } catch (error) {
    console.error(error)
  }
  return response
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

function getQuantity(strQuantity, productId, stock) {
  var newQuantity = parseInt(strQuantity)
    
  try {    
    if (newQuantity <= 0) {
      newQuantity = 1
      // document.getElementById(`quantity${productId}`).value = 1
      // return 1      
    } else if(newQuantity >= stock) {
      newQuantity = stock
    }
  } catch (error) {
    console.error(`Erro: ${error}`)        
  }
  
  return newQuantity
}

function updateTotal() {
  const subtotals = document.getElementsByClassName('subtotal')
  var newTotal = 0
  Object.values(subtotals).forEach(element => {
    var value = element.value.replace('R$', '')
    value = value.replace(',', '.')
    newTotal = newTotal + parseFloat(value)
  })
  return newTotal
}

function commandBackToSite() {
  const form = document.getElementById('cartForm')
  if (form != null) {// I defined it as null when I have not products. But here it is null
    form.submit()  
  } else {
    window.location.href = '/'
  }
}

function deleteItem(productId) {
  
  var redirect = () => {
    var form = document.getElementById('cartForm')
    form.action = `/delete_item?delete=${productId}`
    form.submit()
  }

  redirect()

}

function finalize() {
  
  const redirect = () => {
    const form = document.getElementById('cartForm')
    form.action = `/finalize`
    form.submit()
  }

  redirect()
  
}