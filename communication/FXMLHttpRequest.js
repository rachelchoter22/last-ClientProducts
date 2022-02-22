
function RequestData(urls, parameters, dataToSave = null, headers) {
    this.urls = urls;
    this.parameters = parameters;
    this.dataToSave = dataToSave;
    this.headers = headers
}
function Item(key, value) {
    this.key = key;
    this.value = value;
}
var MethodObject = {
    GET: server.prototype.GetFromLocalStorage,
    POST: server.prototype.SetToLocalStorage,
    DELETE: server.prototype.deleteFromLocalStorage,
    PUT: server.prototype.updateLocalStorage
}
class FXMLHttpRequest {


    constructor() {
        this.readyState = 'UNSENT';
        this.methodType = null;
        this.url = null;
        this.request = null;
        this.response = null;
        this.onreadystatechange = null;
        this.headers = {};
    }
    open(methodType, url, conetntObject) {
        this.readyState = 'OPENED';
        this.onChangeState();
        this.methodType = methodType;
        var urlArray = getRequestUrlByflatUrl(url.split('?')[0])
        var urlItems = getItemsArrayByArguments(url.split('?')[1]);

        switch (methodType) {
            case 'DELETE':
            case 'GET': {
                this.request = new RequestData(urlArray, urlItems, null, this.headers);
            } break;
            case 'POST':
            case 'PUT': {
                this.request = new RequestData(urlArray, urlItems, conetntObject, this.headers);
            }

        }
    }

    setRequestHeader(headerName, headerValue) {
        this.headers[headerName] = headerValue;
    }
    onChangeState() {
        if (typeof this.onreadystatechange === 'function')
            this.onreadystatechange();
    }
    send() {
        this.readyState = 'HEADERS_RECEIVED';
        this.onChangeState();
        this.response = MethodObject[this.methodType].apply(this, [this.request]);
        this.readyState = 'LOADING';
        this.onChangeState();
        if (this.response) {
            this.readyState = 'DONE';
            this.onChangeState();
        }
    }
    onload() {
        this.readyState = 'LOADING';
        this.onChangeState();
    }
}

function getRequestUrlByflatUrl(flattUrl) {
    return flattUrl.split('/').splice(1, 10)
}
//לוקח את הערכים לחיפוש לפי & ואחכ =
function getItemsArrayByArguments(urlArguments) {
    if (!urlArguments) return;
    var splitByProfit = [];
    urlArguments.split('&').forEach(element => {
        var key = element.split('=')[0];
        var value = element.split('=')[1];
        var item = new Item(key, value);
        splitByProfit.push(item);
    });
    return splitByProfit;
}