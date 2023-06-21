const sampleForm = document.getElementById("sample-form");
let form = document.getElementById("from-data")

console.log (sampleForm.value)
let SERVER_URL = 'localhost:3500/api/student'

sampleForm.addEventListener('click', (e) => {
e.preventDefault()
    console.log("Asdadewfewf")
    let formData = new FormData(form)

    let data = JSON.stringify(Object.fromEntries(formData))
    console.log(data)
    sendPOSTRes(SERVER_URL, data)
})

async function sendPOSTRes(url, data) {
    let xhr = new XMLHttpRequest();
   // xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", (e) => {
        if (this.readyState === 4) {
            console.log(this.responseText)
        }

    })
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
}
