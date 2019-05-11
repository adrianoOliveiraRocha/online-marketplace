function chekPrice(price) {
  var numericPrice = price.replace(',', '.')
  var numericPrice = numericPrice.replace('R$', '')
  try {
    numericPrice = parseFloat(numericPrice)
    return numericPrice
  } catch (error) {
    console.error(error.message)
    return false
  }
}

function validateProduct() {
  try {
    const form = document.getElementById('form')
    var name = document.getElementById('name').value
    var description = document.getElementById('description').value.trim()
    var price = document.getElementById('price').value
    var quantity = document.getElementById('quantity').value

    let errors = []

    if (name == '') {
      errors.push('<strong>Por favor! preencha o campo nome</strong>')
    }

    if (description == '') {
      errors.push('<strong>Por favor! preencha o campo descrição</strong>')
    }

    price = chekPrice(price)
    if (!price) {
      errors.push('<strong>Por favor! preencha o campo preço corretamente</strong>')
    } else {
      document.getElementById('price').value = price
    }

    if(quantity == '') {
      errors.push('<strong>Por favor! preencha o campo quantidade</strong>')
    }

    if (Object.keys(errors).length > 0) {
      var msgErrors = ''
      errors.forEach((message) => {
        msgErrors += `
        <div class="alert alert-warning"  role="alert">
          ${message}
        </div>
        `
      })
      document.getElementById('messages').innerHTML = msgErrors

    } else {
      document.getElementById('messages').innerHTML = ''
      // alert('all rigth')
      form.submit()
    }

  } catch (error) {
    console.error(`Oh my god! I have an error: ${error}`)
  }
}


function editProduct() {
  var price = chekPrice(document.getElementById('price').value)
  console.log(`price: ${price}`)
  if (!price) {
    let msg = `
    <div class="alert alert-warning" >
      Por favor, preencha o campo <strong>preço</strong> corretamente.
    </div>`
    document.getElementById('messages').innerHTML = msg
  } else {
    document.getElementById('messages').innerHTML = ''
    document.getElementById('price').value = price
    document.getElementById('form').submit()
  }
}

function deleteProduct() {
  const idProduct = document.getElementById('idProduct').value
  const imageName = document.getElementById('imageName').value
  location.href = `/delete_product?idProduct=${idProduct}&imageName=${imageName}`
  // location.href = "/delete_product?idProduct=" + idProduct
}
