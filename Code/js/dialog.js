document.addEventListener('DOMContentLoaded', function() {displayDialog();})

function displayDialog() {
    var dialogDiv = document.getElementById('dialog');
    dialogDiv.innerHTML = sessionStorage.getItem('dialog');
    dialogDiv.scrollTop = dialogDiv.scrollHeight;
}

function addDialog(text) {
    var dialogContent = sessionStorage.getItem('dialog');
    dialogContent += text;
    sessionStorage.setItem('dialog',dialogContent);
    displayDialog();
}

