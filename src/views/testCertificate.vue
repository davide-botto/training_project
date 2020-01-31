<template>
  <div></div>
</template>


<script>
import jsPDF from 'jspdf';
export default {
  data() {
    return {};
  },
  created() {
    // creazione istanza
    var doc = new jsPDF();
    // creazione file
    doc.text("Hello world!", 10, 10);
  }
};
</script>