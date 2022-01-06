function sendCreateAccount() {
    var url = "https://api.azota.vn/api/Auth/registerForStudent";

var xhr = new XMLHttpRequest();
xhr.open("POST", url);

xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      var tokenLogin = JSON.parse(xhr.responseText).data.rememberToken;
      if(tokenLogin || xhr.status < 300) {
        console.log("Create Account OK")
        sendRequest(getIdFromUrl(designUrl(getUrl(input_url))), tokenLogin, JSON.parse(xhr.responseText).data);
      } else {
        console.log("Create Account Failed")
        
          backToDefaultHome();
      }
   }};  

var data = `{   
  "phone": ${getRandomNumberPhone()},
  "fullname": "?*𝑈𝑛𝑘𝑛𝑜𝑤𝑛𝑁𝑎𝑚𝑒 𝟱𝟬𝟭 - 𝑇ℎ𝑖𝑠 𝑖𝑠 𝑎𝑛 𝑒𝑟𝑟𝑜𝑟 𝑤ℎ𝑖𝑙𝑒 𝑔𝑒𝑡𝑡𝑖𝑛𝑔 𝑠𝑡𝑢𝑑𝑒𝑛𝑡 𝑖𝑛𝘧𝑜𝑟𝑚𝑎𝑡𝑖𝑜𝑛",
  "password": "theazota",
  "tokenCaptcha": "03AGdBq273cgaXSKmB8tmWeckU5DQhaNxQnQx8D1zA7hzDeZP8Uv-YTvjFnLQoHd5i4dCnk9P1-SW_YFqS0N848_YtFSzs2pC_1do_R9i9tokZ-zc2nQn2xxsFz3snBId1xxWLoGJpVvXMvttqVZCvspKkTpCHNKEX9tPk34ubbCDXxPUItS5lnKGe1GPEyxxepu2eORaTDgMwOSgMxqeX_Ya_6_KNW67Wmt09DAAmPX5NQdN9nslrOJ7Fa7479wu69mwpJLJVrHaeuPW8zMIosLIZstwWvQvZK-U-4k1ykm-GCFxCjPyaE4a_fGXoG2GmQBkgBu8Twj8qpb7TX4fptbxh5vNARo3jmlgEk_sf0-093rcaKMgXg7RMrqFiNIuKAW1OOD8S-wsAAhjFaNfPjVgKT17ggwoJAty2YzZ4dqH0WcCzGRG8ybCGYw6HA4oUU54aY7U5DXS25h6qMmzGGoJ_gTZTUs9GB-OHLV_4Ogv6ZTUx9ft_dioy0BAxMvw2RQExSZIlytvG"
}`;

xhr.send(data);
}

function getRandomNumberPhone() {
    var phoneNumber = "";
    for(var i = 1; i <= 10; i++) {
        phoneNumber += Math.floor(Math.random() * 10);
    }

    return phoneNumber;
} 
