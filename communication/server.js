class server {


    GetFromLocalStorage(request) {

        var response = new FResponse(404, {}),
            storageKey = request.urls[0],
            storgeValue = JSON.parse(DB.prototype.Get(storageKey));
        try {
            if (!storgeValue) return response;
            var data = getResByRequest(request, storgeValue);
            if (data && data.length != 0) {
                response = new FResponse(200, data);
            }
            else return response;
        }
        catch (err) {
            response = new FResponse(500, err)
        }

        return response;
    }
    SetToLocalStorage(request) {
        var response = new FResponse(404, {}),
            storageKey = request.urls[0],
            storageValue = JSON.parse(DB.prototype.Get(storageKey));
        try {
            if (!storageValue) {
                var array = [];
                array.push(request.dataToSave);
                DB.prototype.Set(storageKey, JSON.stringify(array));
                response = new FResponse(200, request.dataToSave);
            }
            else {
                var data = getResByRequest(request, storageValue);
                var isExist = data.filter(item => JSON.stringify(item) == JSON.stringify(request.dataToSave));
                if (isExist.length)
                    response = new FResponse(403);
                else {
                    var valueToSet = setToStorageByUrls(request, storageValue);
                    DB.prototype.Set(storageKey, JSON.stringify(valueToSet));
                    response = new FResponse(200, valueToSet);
                }
            }


        }
        catch (err) {
            response = new FResponse(500, err)
        }
        return response;
    }
    deleteFromLocalStorage(request) {
        var response = new FResponse(404, {}),
            storageKey = request.urls[0],
            storgeValue = JSON.parse(DB.prototype.Get(storageKey));
        try {
            if (!storgeValue) return response;
            if (request.parameters || request.urls.length > 1) {
                var valueAfterDelete = deleteFromStorage(request, storgeValue);
                DB.prototype.Set(storageKey, JSON.stringify(valueAfterDelete));
                response = new FResponse(200, storgeValue);
            }
            else {
                DB.prototype.Remove(storageKey);
                response = new FResponse(200, storgeValue);
            }

        }
        catch (err) {
            response = new FResponse(500, err)
        }

        return response;
    }
    updateLocalStorage(request) {
        var response = new FResponse(404, {}),
            storageKey = request.urls[0],
            storgeValue = JSON.parse(DB.prototype.Get(storageKey));
        try {
            if (!storgeValue) return response;
            if (request.parameters || request.urls) {
                var valueAfterUpdate = updateStorage(request, storgeValue);
                if (valueAfterUpdate)
                    DB.prototype.Set(storageKey, JSON.stringify(valueAfterUpdate));
                response = new FResponse(200, storgeValue);
            }
        }
        catch (err) {
            response = new FResponse(500, err)
        }
        return response;
    }
}

function FResponse(status, body) {
    this.status = status;
    this.statusText = statusesEnum[status];
    this.body = body;
}
let statusesEnum = {
    200: "OK",
    403: 'Forbidden',
    404: "Not found",
    500: 'Internal Server Error'

};
function getResByRequest(request, storageValue) {
    var dataInPlace = filterByUrls(request.urls, storageValue),
        dataAfterFilter = filterByParams(request.parameters, dataInPlace);;
    return dataAfterFilter;
    // if (request.headers && request.headers['search-in-first']) {

    //     filterByParams(request.parameters, storageValue);
    //     filterByUrls(request.urls, storageValue);
    //     return storageValue;
    // }
    // else {
    //     filterByUrls(request.urls, storageValue);
    //     filterByParams(request.parameters, storageValue);
    //     return storageValue;
    // }



}

function filterByUrls(urls, storageValue) {
    var resData = storageValue;
    urls.forEach(url => {
        if (storageValue && storageValue[0] && storageValue[0][url]) {
            resData = storageValue[0][url];
        }
        if (storageValue && storageValue[url])
            resData = storageValue[url];
    });
    return resData;
}
function filterByParams(params, arrayToFilter) {
    if (params)
        params.forEach(parameter => {
            arrayToFilter = arrayToFilter.filter(item => item[parameter.key] == parameter.value);
        });
    return arrayToFilter;
}
//from post
function setToStorageByUrls(request, storageValue) {
    var pointer = storageValue;
    request.urls.forEach((url) => {
        if (storageValue && storageValue[0] && storageValue[0][url]) {
            pointer = storageValue[0][url];
        }
        if (storageValue && storageValue[url]) {
            pointer = storageValue[url];
        }
    });
    pointer.push(request.dataToSave);
    return storageValue;
}
function deleteFromStorage(request, storageValue) {
    var deleteArray = null,
        arrayToCompere,
        indexes = [];
    request.urls.forEach(url => {
        if (storageValue && storageValue[0] && storageValue[0][url]) {
            deleteArray = storageValue[0][url];
            arrayToCompere = storageValue[0][url];;
        }
        if (storageValue[url]) {
            deleteArray = storageValue[url];
            arrayToCompere = storageValue[url];;
        }
    });
    if (request.parameters) {
        request.parameters.forEach(parameter => {
            deleteArray = deleteArray.filter(item => item[parameter.key] == parameter.value);
        });
    };
    deleteArray.forEach(item => {
        indexes.push(arrayToCompere.findIndex(x => JSON.stringify(x) == JSON.stringify(item)));
    });
    indexes.forEach(index => {
        arrayToCompere.splice(index, index + 1);
    });
    return storageValue;

}
function updateStorage(request, storageValue) {
    var arrayToUpdate = null,
        arrayToCompere,
        indexes = [];
    var isFirst = isToSearchInFirstObject(request);

    if (isFirst)//search for user and update his product list
    {
        arrayToUpdate = storageValue;
        arrayToCompere = storageValue;
        if (request.parameters) {//search for user
            request.parameters.forEach(parameter => {
                arrayToUpdate = arrayToUpdate.filter(item => item[parameter.key] == parameter.value);
            });
        };
        //get place to update
        request.urls.forEach(url => {
            if (arrayToUpdate && arrayToUpdate[0] && arrayToUpdate[0][url]) {
                arrayToUpdate[0][url] = request.dataToSave;

            }
            if (arrayToUpdate[url])
                arrayToUpdate = request.dataToSave;
        });

        return storageValue;

    }
    else {

        request.urls.forEach(url => {
            if (storageValue && storageValue[0] && storageValue[0][url]) {
                arrayToUpdate = storageValue[0][url];
                arrayToCompere = storageValue[0][url];
            }
            if (storageValue[url]) {//go to product list
                arrayToUpdate = storageValue[url];
                arrayToCompere = storageValue[url];;
            }
        });
        if (request.parameters) {//search for product to update
            request.parameters.forEach(parameter => {
                arrayToUpdate = arrayToUpdate.filter(item => item[parameter.key] == parameter.value);
            });
        };

        arrayToUpdate.forEach(item => {
            indexes.push(arrayToCompere.findIndex(x => JSON.stringify(x) == JSON.stringify(item)));
        });
        indexes.forEach(index => {
            arrayToCompere[index] = request.dataToSave;
        });
        return storageValue;
    }
}

function isToSearchInFirstObject(req) {
    return req.headers && req.headers['search-in-first'];
}