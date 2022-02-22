function addProduct() {

    var productName = document.querySelector('.page.active input[name="productName"]').value;
    var productCompany = document.querySelector('.page.active input[name="productCompany"]').value;
    var productAmount = document.querySelector('.page.active input[name="productAmount"]').value;
    var product = new Product(productName, productCompany, productAmount);
    var fxhr = new FXMLHttpRequest();
    fxhr.open('POST', '/currentUser/productList', product);

    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                buildProductListHtml();
            }
            else if (fxhr.response.status == 403) {
                alert('המוצר כבר קיים');
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
        }
    };
    fxhr.send();
}
//נקראת בכל שינוי ברשימת מוצרים
function buildProductListHtml() {
    var fxhr = new FXMLHttpRequest();
    fxhr.open('GET', '/currentUser/productList')

    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                //מעדכנים רשימת מוצרים תחת UserList
                updateProductListInUsers(fxhr.response.body.productList);
                document.getElementsByClassName('card-list')[0].innerHTML = createHtml(fxhr.response.body);
                navigateTo('productList');

            }
            else if (fxhr.response.status == 404) {
                navigateTo('productList');
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
        }
    };
    fxhr.send();
}
function createHtml(products) {
    var html = '';
    if (products) {
        products.forEach(product => {
            html += `<div class='product-card'>${createDiv('שם המוצר', product.productName) +
                createDiv('שם החברה', product.productCompany) +
                createDiv('כמות', product.productAmount) +
                createButton('מחיקה', 'deleteProduct') +
                createButton('הוספת כמות', 'editProductAmount')} </div>`;
        });
    }
    return html;
}
function createDiv(description, value) {
    return `<div class='card-row'> ${description} : ${value}</div>`;
}
function createButton(description, actionName) {
    return `<button class='' onclick="${actionName}(event)"> ${description}</button>`;

}
function deleteProduct(event) {
    var arrayValues = [],
        product = null;
    event.currentTarget.parentElement.querySelectorAll('div[class="card-row"]').
        forEach(div => {
            arrayValues.push(div.innerText.split(':')[1].replace(' ', ''));
        });
    product = new Product(arrayValues[0], arrayValues[1], arrayValues[2]);
    var fxhr = new FXMLHttpRequest();
    fxhr.open('DELETE', `/currentUser/productList?productName=${product.productName}&productCompany=${product.productCompany}`);

    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                buildProductListHtml();
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
            else console.log(fxhr.response.status)

        }
    };
    fxhr.send();
}
function editProductAmount(event) {
    var arrayValues = [],
        product = null;
    event.currentTarget.parentElement.querySelectorAll('div[class="card-row"]').
        forEach(div => {
            arrayValues.push(div.innerText.split(':')[1].replace(' ', ''));
        });
    product = new Product(arrayValues[0], arrayValues[1], arrayValues[2]);

    product.productAmount++;
    var fxhr = new FXMLHttpRequest();
    fxhr.open('PUT', `/currentUser/productList?productName=${product.productName}&productCompany=${product.productCompany}&productAmount=${(product.productAmount - 1)}`, product);

    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                buildProductListHtml();
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
        }
    };
    fxhr.send();
}

function updateProductListInUsers(products) {
    var user = null;
    var fxhr = new FXMLHttpRequest();
    fxhr.open('GET', '/currentUser');
    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                user = fxhr.response.body;
            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
        }
    };
    fxhr.send();

    var fxhr = new FXMLHttpRequest();
    fxhr.open('PUT', `/UserList/productList?userName=${user.userName}&userPassword=${user.userPassword}`, products);
    fxhr.setRequestHeader('search-in-first', true);
    fxhr.onreadystatechange = function () {
        if (fxhr.readyState == 'DONE') {
            if (fxhr.response.status == 200) {
                console.log('products saved');

            }
            else if (fxhr.response.status == 500) {
                console.log(fxhr.response.data);
            }
        }
    };
    fxhr.send();
}