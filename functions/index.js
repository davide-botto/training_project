const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
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


