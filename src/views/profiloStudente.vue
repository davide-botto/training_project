<template>
    <div class="home">
        <TopBar />
    </div>
</template>

<script>
import TopBar from "../components/TopBar";
import { mapGetters } from "vuex";
//import { db } from "@/fb";

export default {
    data() {
        return {
            student: {}
        };
    },
    created() {

    this.$store.dispatch("topbar/act_setBar", {
        courseTitle: false,
        coursePage: false,
        students: false,
        profile: true,
        toHome: true,
        exit: true
      })
  },
  computed: {
      ...mapGetters ({
          user: "authentication/user",
          barprop: "topbar/barprop"
      })
  },
  components: {
      TopBar
  },
  
    
}
</script>