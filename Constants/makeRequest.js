function makeRequest(method, url, body) {
    return new Promise((res, rej) => {
        const req = new XMLHttpRequest();
        req.onload = () => {            
            if(req.status >= 200 && req.status <= 299) {
                if(req.responseText) {
                    try {
                        res(JSON.parse(req.responseText));
                    } catch {
                        res(req.responseText);
                    }
                } else {
                    res(req.responseText);
                }
            } else {                
                rej('Error: ' + req.responseText);
            }
        }
        req.open(method, url);
        if (body) {
            req.setRequestHeader('Content-Type', 'application/json');
        }
        req.send(body || null);
    })    
}