/* NODE CLient

*Execution : npm install && npm start 

*/
 /* Packages */
const fs = require("fs");
const request = require('request');
const Url = require('url-parse');
const { JSDOM } = require("jsdom");
var LIEN = "https://robohash.org/";

 /* Fonctions */

 chargement = (url, nomfichier, errCB) => {
    try {
        request.get(url)
            .on('response', (response) => {     //Succes fonction
                console.log(response.statusCode, url, "est bien téléchargée");
            }).pipe(fs.createWriteStream(`./Images/${nomfichier}.png`)) //Téléchargement
            .on('error', errCB)   //error fonction

    } catch (error) {
        console.log("errCb pas pu géréré cette erreur ", url)
    }
}

recupereImages = (url, prefixe, errCb) => {
    let urlInfo = new Url(url);//Analyse 
    chargement(url, `${prefixe}.${urlInfo.pathname.split(".")[1]}`, errCb);//Transformation de Lien 
}

/* Main  or Request (Fetch) */
request(LIEN, (error, response, body) => {
    if (response.statusCode === 200) { //Status 200  =: Ok 
        //fetch est terminé
        console.log('passe le site vers la fonction de téléchargement');
        const dom = new JSDOM(body); //recrée un DOM en mémoire.
        let links = dom.window.document.querySelectorAll("img"); // Récuperation de toutes les images depuis le DOM Virtuel
        let url = new Url(LIEN);
        links.forEach((element, index) => {
            let lienImage;
            element.getAttribute('src').includes(url.protocol) ? lienImage = element.getAttribute('src') : lienImage = url.protocol + element.getAttribute('src');
            recupereImages(lienImage, url.host.split(".")[0] + index, (err) => { console.log(err, element.getAttribute('src')) });
        });
        console.log(`Le Téléchargement des images du ${LIEN} est Terminé`);
    } else {
        //  Erreur de fetch 
        console.log('erreur', response.statusCode, error);
    }
});


