function onSubmit() {
    var userName = document.querySelector('.page.active  input[name="userName"]').value;
    var userPassword = document.querySelector('.page.active  input[name="userPassword"]').value;


    checkIfUserExist(userName, userPassword);

};
function checkIfUserExist(userName, userPassword) {
    var fxhr = new FXMLHttpRequest();
    fxhr.open('GET', '/UserList?userName=' + userName + '&userPassword=' + userPassword);
    fxhr.onreadystatechange = (() => {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                initCurrentUser(fxhr.response.body[0]);
                buildProductListHtml();
            }
            else if (fxhr.response.status == 403) {
                alert('המשתמש קיים');
            }
            else if (fxhr.response.status == 404) {
                alert('המשתמש לא קיים יש להירשם');
                navigateTo('signUp');
            }
            else {
                console.log(fxhr.response.data);
            }
        }
    });
    fxhr.send();
}
//נקרא בעת הרשמה ולוגין
function initCurrentUser(user) {
    var fxhr = new FXMLHttpRequest();
    fxhr.open('POST', '/currentUser', user);
    fxhr.onreadystatechange = (() => {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {

            }
            else if (fxhr.response.status == 403) {
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
        }
    });
    fxhr.send();
}
//בודק אם יש יוזר בלוגין
function isLogIn() {
    var res;
    var fxhr = new FXMLHttpRequest();
    fxhr.open('GET', '/currentUser');
    fxhr.onreadystatechange = (() => {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                // בודק אם חזר יוזר תחת currentUser
                if (fxhr.response.body) {
                    res = true;
                }
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
                res = false;
            }
        }
    });
    fxhr.send();
    return res;
}
//כפתור יציאה - מוחקים את currentUser
function logOut() {
    var fxhr = new FXMLHttpRequest();
    fxhr.open('DELETE', '/currentUser');
    fxhr.onreadystatechange = (() => {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                if (fxhr.response.body) {
                    res = true;
                }
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
                res = false;
            }
        }
    });
    fxhr.send()
}