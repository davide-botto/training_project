<template>
  <div class="corso">
    <TopBar :properties="properties" />
  </div>
</template>

<script>
import TopBar from "../components/TopBar"

export default {
  data() {
    return {
      properties: {
        courseTitle: false,
        coursePage: true,
        students: false,
        home: true,
        exit: true
      }
    };
  },
  components: {
    TopBar
  }
};
</script>
