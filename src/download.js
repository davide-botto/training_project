
//******** Carico la libreria FileSaver *********/
var FileSaver = require('file-saver');
/**------------------------------------------------------------
 * Scarico il payload del file e lo converto in stringa base 64 
  ---------------------------------------------------------------*/
export function downloadImage(urlProfileImage, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlProfileImage);   // Make sure file is in same server
    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    xhr.send();

    let base64String;
    //************ NB: non posso fare il return ************* */
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if ((xhr.status == 200) || (xhr.status == 0)) {

                base64String = "data:image/jpg;base64," + encode64(xhr.responseText);
                callback(base64String);

            } else {
                alert("Something misconfiguration : " +
                    "\nError Code : " + xhr.status +
                    "\nError Message : " + xhr.responseText);
                return;
            }
        }
    };

}

/**--------------------------------------------------------------
 **************** Scarico il file PDF direttamente ******************
 ----------------------------------------------------------------*/
export function downloadPDF(urlFile) {
    var request = new XMLHttpRequest();
    request.open("GET", urlFile, true);
    request.responseType = "blob";
    request.onload = function () {
        var file = new Blob([request.response], {
            type: 'application/pdf'

            
        });
        
        FileSaver.saveAs(file);

    };
    request.send();
}

//*********** Conversione in stringa Base64 ************/
export function encode64(inputStr) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var outputStr = "";
    var i = 0;

    while (i < inputStr.length) {
        var byte1 = inputStr.charCodeAt(i++) & 0xff;
        var byte2 = inputStr.charCodeAt(i++) & 0xff;
        var byte3 = inputStr.charCodeAt(i++) & 0xff;

        var enc1 = byte1 >> 2;
        var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);

        var enc3, enc4;
        if (isNaN(byte2)) {
            enc3 = enc4 = 64;
        } else {
            enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
            if (isNaN(byte3)) {
                enc4 = 64;
            } else {
                enc4 = byte3 & 63;
            }
        }
        outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
    }
    return outputStr;
}

