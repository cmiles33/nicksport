<template>
  <div class="login-container">
    <div class="columns">
      <div class="column">
        <h1 class="title">Welcome To The Log-in/Out Area</h1>
        <p class="subtitle">Login your current account.</p>
        <authenticator :services="{services}" :login-mechanisms="['username']" :hide-sign-up="true">
          <template  v-slot="{signOut}">
            <button @click="signOut">Sign Out</button>
          </template>
        </authenticator>
      </div>
    </div>
  </div>
</template>
<script>
import {Authenticator} from "@aws-amplify/ui-vue";
import { Auth } from 'aws-amplify';

const services = {
  async handleConfirmSignIn(formData)
  {
    let {user, code, mfaType} = formData;
    console.log("sign in confirmed")
    return Auth.confirmSignIn(
        user,
        code,
        mfaType,
    )
  }
}


export default {
  name: "LoginView",
  components:{
    Authenticator,
  },
  data(){
    return{
      services,
    }
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