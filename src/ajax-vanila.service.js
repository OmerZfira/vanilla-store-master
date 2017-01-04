function DataService() { }

DataService.http = function (path, method, data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, path);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                cb(JSON.parse(xhr.responseText));
            } else {
                console.log('There was a problem with the request.');
            }
        }
    };
    xhr.send(data);
};


DataService.path = '//mrjson.com/data/5852475dfd12d7017514212a/product/list.json';

DataService.createPath = function (id) {
    var path = DataService.path;
    if (id) path = path.replace('list.json', id + '.json');
    return path;
};

DataService.query = function (cb) {
    return DataService.http(DataService.createPath(), 'GET', null, cb);
};

DataService.get = function (id, cb) {
    return DataService.http(DataService.createPath(id), 'GET', null, cb);
};

DataService.remove = function (id, cb) {
    return DataService.http(DataService.createPath(id), 'DELETE', null, cb);
};

DataService.add = function (obj, cb) {
    return DataService.http(DataService.createPath('item'), 'POST', JSON.stringify(obj), cb);
};

DataService.update = function (obj, cb) {
    return DataService.http(DataService.createPath(obj.id), 'PUT', JSON.stringify(obj), cb);
};


// DataService.query(res => console.log('Result from server: ', res));
// DataService.get(38, res => console.log('Result from server: ', res));
// DataService.add({puki: 'ben-david', age:89}, res => console.log('Result from server: ', res));



export default {
    DataService
}