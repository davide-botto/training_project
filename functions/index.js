const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
    // context contienen informazioni su user al momento in cui effettua la richiesta
    // Verifico che la richiesta sia effettuata da un ADMIN
    if (context.auth.token.admin !== true) {
        return {error: 'Solo gli amministratori possono creare altri amministratori'}
    }
    // GET USER AND ADD CUSTOM CLAIM
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        });

    }).then(() => {
        return {
            message: `L'utente ${data.email} è stato reso amministratore.`
        }
    }).catch(err => {
        return err;
    });

});


