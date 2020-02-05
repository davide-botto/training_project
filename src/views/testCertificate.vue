<template>
  <div align="center">
    <div id="certificateTable">
      <table width="600" class="mx-5">
        <thead>
          <tr align="center">
            <th colspan="2">
              <h2>Scuola di formazione per sviluppatori</h2>
            </th>
          </tr>
          <tr align="center">
            <th colspan="2">
              <h3>Attestato di frequenza</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr id="text" align="justify" class="mx-10">
            <td colspan="2">
              <p>
                Si certifica che lo studente {{student.toString().toUpperCase()}} ha partecipato al workshop
                <b>{{course}}</b> e ha superato l'esame per l'acquisizione dei crediti ECM.
              </p>
            </td>
          </tr>
          <tr class="mx-10">
            <td>Vicoforte, {{date}}</td>

            <td align="center">Firma</td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-btn @click="makeCertificate()">Genera certificato</v-btn>
  </div>
</template>


<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "@/formatDate";
export default {
  data() {
    return {
      course: "Nuovi strumenti per lo sviluppo web",
      student: "Mario Rossi",
      date: this.printDate(new Date().toISOString().substring(0, 10))
    };
  },

  methods: {
    printDate(date) {
      return formatDate(date);
    },
    makeCertificate() {
      // creazione istanza
      html2canvas(document.getElementById("certificateTable")).then(canvas => {
        let imgData = canvas.toDataURL("image/jpeg", 3);
        let pdf = new jsPDF("p", "mm", "a4");
        let pageWidth = pdf.internal.pageSize.getWidth();
        let pageHeight = pdf.internal.pageSize.getHeight();
        let imageWidth = canvas.width;
        let imageHeight = canvas.height;

        let ratio =
          imageWidth / imageHeight >= pageWidth / pageHeight
            ? pageWidth / imageWidth
            : pageHeight / imageHeight;
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          imageWidth * ratio,
          imageHeight * ratio
        );
        pdf.save("Test.pdf");
      });
    }
  }
};
</script>
<style scoped>
td,
th {
  border: 1px solid #999;
}
</style>