class Pexels {
    static api_key = "563492ad6f91700001000001b7f8998eacb449ceba4325318182d154";
    static api_url = "https://api.pexels.com/v1/search"
    static google = "https://flipnsearch.herokuapp.com/"
    static duckgo = "https://flipnism.vercel.app/api/request/"

    constructor() {

    }
    doRequest(url, searchEngine) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            const method = "GET";
            req.timeout = 15000;
            req.onload = () => {
                if (req.status === 200) {
                    try {
                        resolve(req.response);
                    } catch (err) {
                        reject(`Couldn't parse response. ${err.message}, ${req.response}`);
                    }
                } else {
                    reject(`Request had an error: ${req.status}`);
                }
            }
            req.ontimeout = () => {
                console.log("polling..")
                resolve(this.doRequest(url))

            }
            req.onerror = (err) => {
                console.log(err)
                reject(err)
            }
            req.open(method, url, true);
            if (searchEngine == "pexels")
                req.setRequestHeader('Authorization', Pexels.api_key);
            req.send();
        })
    }
    getImages(keyword, searchEngine, islarge) {
        return new Promise(async(resolve, reject) => {
            let url = "";
            switch (searchEngine) {
                case "pexels":
                    url = `${Pexels.api_url}?query=${keyword.replace(" ","+")}&per_page=20`;
                    break;
                case "google":
                    url = `${Pexels.google}${keyword.replace(" ","%20")}`;
                    break;
                case "duckgo":
                    url = `${Pexels.duckgo}${keyword.replace(" ","%20")}`;
                    break;
                default:
                    break;
            }

            try {
                console.log(url);
                const result = await this.doRequest(url, searchEngine);
                resolve(result);
            } catch (err) {
                console.log(err)
            }
        })

    }




}

module.exports = {
    Pexels,
    GOOGLE:"google",
    PEXEL:"pexels",
    DUCKGO:"duckgo"
}