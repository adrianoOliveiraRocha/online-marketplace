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

function updatePendingOrders() {
	
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			    document.getElementById("notification").innerHTML =
			    this.responseText;
			}
		
	}

	xhttp.open("GET", '/notification', true);
	xhttp.send()

}