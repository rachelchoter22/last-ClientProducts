function SignUP() {

    var userName = document.querySelector('.page.active  input[name="userName"').value;
    var userPassword = document.querySelector('.page.active  input[name="userPassword"').value;
    var userEmail = document.querySelector('.page.active input[name="userEmail"').value;

    var user = new User(userName, userPassword, userEmail, []);
    var fxhr = new FXMLHttpRequest();

    fxhr.open('POST', '/UserList', user);

    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                initCurrentUser(user);
                buildProductListHtml();
            }
            else if(fxhr.response.status == 500){
                console.log(fxhr.response.data);
            }
        }
    };
    fxhr.send();
}