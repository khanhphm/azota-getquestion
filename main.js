var iframe = document.getElementById("iframe");
var button_go = document.getElementById("button_go");
var iframe_div = document.getElementById("iframe-div");
var input_url = document.getElementById('input_url');
var input_password = document.getElementById('input_password');
var button_view = document.getElementById("button_view");
var question_viewer = document.getElementById("question-viewer");
var form = document.getElementById("form");
button_go.onclick = (e) => {
    if (canGo(getUrl(input_url))) {
        url = designUrl(getUrl(input_url));
        iframe_div.style.display = "block";
        iframe.setAttribute("src", url)
    } else {
    }
}
function designUrl(url) {
    if (!url.includes("azota.vn")) {
        url = "https://azota.vn/de-thi/" + url;
    }
    return url;
}
function canGo(url) {
    if (url == "") {
        return false;
    }
    return true;
}
function getUrl(input_url) {
    return input_url.value;
}
function getPwd(input_pwd) {
    return input_pwd.value;
}
function getIdFromUrl(fullUrl = "") {
    return fullUrl.slice(fullUrl.indexOf("/", 23)).substring(1);
}
document.addEventListener("keydown", e => {
    if (e.key == "F11") e.preventDefault();
});