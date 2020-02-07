// ******* GENERA DOCUMENTO PDF LATO CLIENT CON LIBRERIA pdfmake ******* //
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as head from "@/Header.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function generateDocument() {
    var dd = {
        // ****** FOOTER *********//
        footer: function(/*currentPage, pageCount*/) { return [
            {image: head.footer,
            width: '560',
            height: '80',
            margin: [20,0]
            }] },
        // ******** HEADER ******** //
          header: function(/*currentPage, pageCount, pageSize*/) {
            // you can apply any logic and return any valid pdfmake element
        
            return [
            {image: head.header,
        width: '525',
        height: '90',
        margin: [35,0]
               
            }]},
        
        //******** TESTO DEL DOCUMENTO  ********/
        content: [
            {text: 'Il modulo riguarda gli studenti frequentanti il Terzo o Quarto Anno di Corso interessati a svolgere stage estivo in azienda.', margin:[0,70,0,5]},
            
            {text: "Per la compilazione serve la compresenza dello studente e dell'esercente la sua patria potestà. Per l'adesione occorre declinare le proprie generalità, dichiarare l'accettazione del regolamento inoltrato alle famiglie con circolare FEBB 2019 e sottoscrivere il modulo da entrambi i dichiaranti. Con la firma l'esercente la patria potestà autorizza lo studente alla partecipazione all'attività in oggetto.", alignment: "justify"},
            {text:"Generalità studente/ssa", style: "title"},
            {table: {
                widths: [100,'*'],
                body: [
                    ["Cognome: ", "Cognome utente"],
                    ["Nome: ", "Nome utente"],
                    ["Nato/a a: ", "Luogo di nascita"],
                    ["Nato/a il: ", "Data di nascita"],
                    ["Indirizzo di residenza: ", "Indirizzo"],
                    ["CAP: ", "CAP"],
                    ["Telefono: ", "Tel."],
                    ["e-mail istituzionale", "email"],
                    ["Classe", "Classe"],
                    ["Settore", "Sett"]
                    ]
            },  margin: [0,0,0,10]
        },
        {text:"Generalità esercente la patria potestà", style: "title",  margin: [0,0,0,5]},
        {table: {
                widths: [100,'*'],
                body: [
                    ["Cognome: ", ""],
                    ["Nome: ", ""],
                    ["Relazione parentale: ", ""],
                    ["Indirizzo di residenza: ", ""],
                    ["CAP: ", ""],
                    ["Telefono: ", ""],
                    
                  
                    ]
            }, margin: [0,0,0,10], pageBreak: 'after'
        },
        {text: "DICHIARAZIONE", style: "title", margin:[0,70,0,5]},
        {text: "Lo studente e l'esercente la sua patria potestà dichiarano:", style: {bold: true}, margin: [0,0,0,5]},
        {ul:[
            {text: "di essere interessati all'attività di stage nel periodo di sospensione delle lezioni;", margin: [0,0,0,5]},
            "di aver preso visione, di condividere in solido e di accettare quanto riportato sulla \"Scheda di presentazione e Regolamento per l'accesso\" inoltrata alle famiglie con Circolare di FEBB 2019 e reperibile sul sito d'Istituto alla pagina Ampliamento offerta / Tirocini Aziendali."
            ],margin: [0,0,0,5]}
        ],

        styles: {
            header: {
                justified: true
            },
            title: {
                fontSize: 15,
                bold: true
            }
        }

    }
    pdfMake.createPdf(dd).open();
}

