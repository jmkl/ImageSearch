const fs = require("uxp").storage.localFileSystem;
const { entrypoints } = require("uxp");

class Token {
    static texturelab_url = "https://flipnism.vercel.app/api/texturelab/list/all"
    static texturelabdata_file = "texturelab_data.json";
    constructor() { }

    async getToken(_key) {
        let persistentokenentry, entryobject;
        try {

            persistentokenentry = localStorage.getItem(_key);
            entryobject = await fs.getEntryForPersistentToken(persistentokenentry);
        } catch (error) {
            entryobject = await fs.getFolder();
            localStorage.setItem(_key, await fs.createPersistentToken(entryobject));

        }

        return Promise.resolve(entryobject);

    }
    async createFile(token) {
        return await token.createFile(Token.texturelabdata_file, { overwrite: true })
            .catch((error) => { reject(error) });
    }
    async readTexturelabFile() {
        return new Promise(async (resolve, reject) => {
            const token = await this.getToken(Token.TexturelabDir);
            await token.getEntry(Token.texturelabdata_file)
                .then(async (result) => {
                    const data = await result.read();
                    resolve(JSON.parse(data));
                }).catch(async (e) => {
                    resolve(await this.writeTexturelabFile());
                })
        })
    }
    async writeTexturelabFile() {
        return new Promise(async (resolve, reject) => {
            await fetch(Token.texturelab_url)
                .then((result) => { return result.json() })
                .then(async (result) => {
                    console.log("fetch online");
                    const token = await this.getToken(Token.TexturelabDir);

                    const tl_file = await this.createFile(token);
                    await tl_file.write(JSON.stringify(result));
                    resolve(result);


                })
        })
    }

}

module.exports = {
    Token,
    DownloadDir: "download_directory",
    TexturelabDir: "texturelab_config_directory"
}
