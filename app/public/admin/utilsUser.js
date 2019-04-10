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

function updateQuantidy(productId) {
  const quantityTd = document.getElementById('quantity' + productId)
  let idInput = 'quantity' + productId + 'value'
  const quantityInput = `
  <input id="${idInput}" type="number" placeholder="Nova Quantidade"/>
  <input type="button" value="ok" 
  onclick="quantityDefined('${idInput}')"/>
  `
  quantityTd.innerHTML = quantityInput

  
}

function quantityDefined(quantityInputId){
  let newQuantity = parseInt(document.getElementById(quantityInputId).value)  
  if(isNaN(newQuantity)) {
    alert('Por favor, preencha o campo quantidade corretamente')
  } else {
    alert(newQuantity)
  }
  
}
