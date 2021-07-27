console.clear()
function currentYear(){
  const d = new Date()
  let yyyy = document.getElementById('year')
  yyyy.textContent = d.getFullYear() 
}
currentYear()()