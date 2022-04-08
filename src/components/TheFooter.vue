<template>
  <div class="footer-container">
    <div class="subtitle">
      This be the mad footing.
      <div class="columns">
        <div class="column">
          <router-link :to="{name: 'log_in'}">
            Login to your account.
          </router-link>
        </div>
        <div class="column">
          <router-link to="/">
            Home Page
          </router-link>
        </div>
        <div v-if="auth.route === 'authenticated'"  class="column">
          <router-link :to="{name: 'create_album'}">
            Make New album
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Auth } from 'aws-amplify';
import { useAuthenticator} from "@aws-amplify/ui-vue";

const auth = useAuthenticator()



export default {
  name: "TheFooter",
  data(){
    return{
      auth,

    }
  },
  components: {

  },
  methods:{
    async signOut() {
      try {
        await Auth.signOut();
        console.log("sign out Successfully")
      } catch (error) {
        console.log('error signing out: ', error);
      }
    }
  }
}
</script>

<style scoped>


</style>