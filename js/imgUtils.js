const md5 = require("./md5");
const { Token, DownloadDir, TexturelabDir } = require("./Token.js");
const { placeLinkedImage } = require("./BPUtils.js");
const token = new Token();
const fs = require("uxp").storage.localFileSystem;
const { Pexels, GOOGLE, PEXEL, DUCKGO } = require("./Pexel.js");

class ImageUtils {
    _mainpanel = $(".tl-content-panel");
    data_to_push = []
    constructor() {
        
     }

     getData(){
         return this.data_to_push;
     }



    async ImageDownloader(imageurl) {
        loading(true);

        const namafile = md5(imageurl) + ".jpg";
        const imgtoken = await token.getToken(DownloadDir);
        await imgtoken.getEntry(namafile).then(async (res) => {
            await placeLinkedImage(await fs.createSessionToken(res));
            loading(false);
        }).catch(async (error) => {

            await fetch(imageurl).then((resp) => {

                if (!resp.ok) {
                    throw new Error("Error :" + resp.status)

                }
                loading(false);
                return resp.arrayBuffer();
            }).then(async (buffer) => {

                const newjpg = await imgtoken.createFile(namafile, { overwrite: true })
                await newjpg.write(buffer, { format: require('uxp').storage.formats.binary }).then(async (resp) => {

                    const jpeg_token = await fs.createSessionToken(newjpg);
                    placeLinkedImage(jpeg_token).then((e) => { loading(false); });
                })

            }).catch((er) => {
                console.log(er);
                loading(false);
            })
        });
    }
    append10Data(classname) {
       
        for (let c = 0; c < 10; c++) {
            try {
                const img = this.data_to_push[c].thumb;
                this._mainpanel.append(`<img class="${classname}" src="${img}"  data-image="${this.data_to_push[c].value}" >`)
                this.data_to_push.splice(0, 1);
            } catch (error) {
                console.log(this.data_to_push.length)
                break;
            }

        }
    }
/**
 * 
 * @params id @params thumb @param value
 * 
 */
    PushList(datas,parent,classname) {
     
        this._mainpanel = parent;
        this._mainpanel.empty();
        this.data_to_push = [];
        $(datas).each((i, v) => {
            this.data_to_push.push({ "id": i, "thumb": v.thumb, "value": v.image });
        })
        this.append10Data(classname);

    }

    createImage(photo, engine) {
        let thumb;
        let ori;
        switch (engine) {

            case GOOGLE:
                thumb = photo.thumbnail;
                ori = photo.original;
                break;
            case PEXEL:
                thumb = photo.src.tiny;
                ori = photo.src.original;
                break;
            case DUCKGO:
                thumb = photo.thumbnail;
                ori = photo.image;
                break;
            default: break;
        }

        const element = `
    <div class="search-img-container">
      <img src="${thumb}" class="search-img lozad" value="${ori}">
    </div>
    `;
        return element;
    }
}
module.exports = {
    ImageUtils
}