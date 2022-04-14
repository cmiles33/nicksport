<template>
  <div class="main-window">
    <div v-for="photo in photo_prev_list" :key="photo">
      <div class="photo-overlay">
        <router-link :to=" {name: 'album.show', params: {slug: photo[0]}} ">
          <img class="center-photo" :src="photo[1]" alt="Whoops....">
          <p class="centered-text">{{photo[0].replace('_',' ')}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import {Auth, Storage} from "aws-amplify";

export default {
  name: 'HomeView',
  components: {
    //HelloWorld
  },
  data()
  {
    return{
      testing: [],
      isAuthed: false,
      username: '',
      album_list: new Set(),
      photo_prev_list: [],
    }
  },
  mounted(){
    this.getAlbumList()
  },
  methods: {
    async getAlbumList()
    {

      Storage.list('').then(results=>{
        results.forEach(result=>{
          let preview_info = []
          let folder = result.key.split('/').slice(0,-1)[0]
          if(!this.album_list.has(folder))
          {
            this.album_list.add(folder)
            preview_info.push(folder)
            Storage.get(result.key).then(photo_url=>{
              preview_info.push(photo_url)
              this.photo_prev_list.push(preview_info)

            })
          }
        })
      })
    },
    testAuth()
    {
      console.log("Checking for current user")
      console.log(Auth.currentUserCredentials())
      console.log(Auth.currentAuthenticatedUser())
      Auth.currentAuthenticatedUser().then(username =>{
        console.log(username)
      })
    },
    async getAuth(){
      try{
        await Auth.currentAuthenticatedUser().then(username=>{
          console.log(username.username)
          console.log(username)
          this.username = username.username
        });
        this.isAuthed = true
        console.log("Is logged in")

      }
      catch{
        this.isAuthed = false
        console.log("Not logged in")
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300&display=swap');

.main-window{
  padding-top: 15px;
  display: grid;

  grid-template-columns: repeat(auto-fill,minmax(600px,1fr));
  grid-gap: 5px 5px;

}
.main-window >div{

}
.main-window >div:nth-child(odd)
{

}

.center-photo{
  grid-column: 1/4;
  grid-row: 1/5;
  justify-self: end;

}

.photo-overlay{
  width: 95%;

  position: relative;
  align-content: center;
  text-align: center;
  color:grey;

  transition: all 0.5s ease-out;

}
.photo-overlay:hover{
  box-shadow: 0 0 10px lightgrey;
  transform: scale(1.04);
}
.centered-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none;
  text-transform: capitalize;
  color: black;

  font-size: 30px;
  font-weight: 400;
  padding: 50px;
  opacity: 60%;
  background-color: lightgrey;
  box-shadow: 5px 5px 10px lightgrey;
  font-family: 'Source Serif Pro', serif;
  transition: all 0.5s ease-out;
}
.centered-text:hover{
  color: white;
  background: black;
  padding: 70px;
  opacity: 70%;
}

.center-photo>img{
  object-fit: scale-down;
  width: auto;
  height: auto;
  max-height: 50%;
  padding-left: 10px;
  padding-top: 10px;
}
@media screen and (max-width:700px)
{
  .main-window{
    padding-top: 15px;
    display: grid;

    grid-template-columns: repeat(auto-fill,minmax(400px,1fr));
    grid-gap: 15px 15px;
    background: firebrick;

  }
}




</style>
