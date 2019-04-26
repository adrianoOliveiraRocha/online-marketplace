function updatePendingOrders() {
	
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			    document.getElementById("pendingOrders").innerHTML =
			    this.responseText;
			}
		
	}

	xhttp.open("GET", '/notification_po', true);
	xhttp.send()

}

function updatePendingOrders() {
	
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			    document.getElementById("pendingOrders").innerHTML =
			    this.responseText;
			}
		
	}

	xhttp.open("GET", '/notification_po', true);
	xhttp.send()

}