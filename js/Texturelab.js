const { Token, DownloadDir, TexturelabDir } = require("./Token.js");
const token = new Token();

class TextureLab {
    static texturelab_url = "https://flipnism.vercel.app/api/texturelab/list/all"
    
    constructor() {
       
    }
    
    async getTextureLabLists() {
        return await token.readTexturelabFile();
    }
    // getTextureLists(){

    //     return new Promise((resolve, reject) => {
    //         const req = new XMLHttpRequest();
    //         const method = "GET";
    //         req.timeout = 15000;

    //         req.onload = () => {
    //             if (req.status === 200) {
    //                 try {
    //                     resolve(req.response);
    //                 } catch (err) {
    //                     console.log("error")
    //                     reject(`Couldn't parse response. ${err.message}, ${req.response}`);
    //                 }
    //             } else {
    //                 console.log("error")
    //                 reject(`Request had an error: ${req.status}`);
    //             }
    //         }
    //         req.ontimeout = () => {
    //             console.log("polling..")
    //             resolve(this.getTextureLists(TextureLab.texturelab_url))

    //         }
    //         req.onerror = (err) => {
    //             console.log(err)
    //             reject(err)
    //         }
    //         req.open(method, TextureLab.texturelab_url, true);

    //         req.send();
    //     })
    // }
}

module.exports = {
    TextureLab
}