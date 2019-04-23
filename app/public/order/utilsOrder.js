function commandBackToSite() {
  const form = document.getElementById('cartForm')
  if (form != null) {// I defined it as null when I have not products. But here it is null
    form.submit()  
  } else {
    window.location.href = '/'
  }
}
