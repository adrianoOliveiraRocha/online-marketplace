function updatePendingOrders() {
	
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			    document.getElementById("pendingOrders").innerHTML =
			    this.responseText;
			}
		
	}

	xhttp.open("GET", '/notification_pending_order', true);
	xhttp.send()

}

function lowStock() {
	console.log('calling lowStock()')
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status == 200) {
			    document.getElementById("lowStock").innerHTML =
			    this.responseText;
			}
		
	}

	xhttp.open("GET", '/notification_low_stock', true);
	xhttp.send()

}