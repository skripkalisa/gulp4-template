"use strict";

console.clear();

function currentYear() {
  var d = new Date();
  var yyyy = document.getElementById('year');
  yyyy.textContent = d.getFullYear();
}

currentYear()();