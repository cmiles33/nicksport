<template>
  <div class="footer-container">
    <div  v-if="auth.route === 'authenticated'">
      <button v-if="showarea" class="button is-small is-black" @click="hidearea">
        Hide Control Zone
      </button>
      <button v-else class="button is-small is-white" @click="hidearea">
       Show Control Zone
      </button>
      <div v-if="showarea" class="subtitle">
        This is your Control Area.

        <div  class="columns">
          <div class="column">
            <router-link :to="{name: 'log_in'}">
              Sign Out / Manage Your Stuff
            </router-link>
          </div>
          <div v-if="auth.route === 'authenticated'"  class="column">
            <router-link :to="{name: 'create_album'}">
              Make New album
            </router-link>
          </div>
          <div class="column">
            <router-link to="/">
              Home Page
            </router-link>
          </div>

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
      showarea: true,

    }
  },
  components: {

  },
  methods:{
    hidearea()
    {
      if(this.showarea === true)
        this.showarea = false
      else
        this.showarea = true
    },
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