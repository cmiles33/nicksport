<template>
  <div class="main-window">
    <div v-for="photo in photo_prev_list" :key="photo">
      <router-link v-if="mobile_view" :to=" {name: 'album.show', params: {slug: photo[0]}} ">
        <div  class="album-text has-text-centered">
          {{photo[0].replaceAll('_',' ')}}
        </div>
      </router-link>
      <div class="photo-overlay">
        <router-link :to=" {name: 'album.show', params: {slug: photo[0]}} ">
          <img class="center-photo" :src="photo[1]" alt="Whoops....">
          <p class="centered-text">{{photo[0].replaceAll('_',' ')}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import {Auth, Storage, API, graphqlOperation} from "aws-amplify";
import {listAlbums} from "@/graphql/queries";



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
      photo_prev_list: [],
      mobile_view: false,
    }
  },
  mounted(){
    this.getAlbumList()
    window.addEventListener('resize',this.handleResize)
    this.handleResize()
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize()
    {
      if(window.innerWidth > 400)
      {
        this.mobile_view = false
      }
      else
      {
        this.mobile_view = true
      }
    },
    async getAlbumList()
    {
      API.graphql(graphqlOperation(listAlbums)).then(results=>{
        const albums = results.data.listAlbums.items
        albums.forEach(album=>{
          let preview_info = []
          preview_info.push(album.name)
          //console.log(album.photos.items[0].preview_key)
          let preview_key = album.photos.items[0].preview_key
          Storage.get(preview_key).then(photo_url=>{
            preview_info.push(photo_url)
            this.photo_prev_list.push(preview_info)
          }).catch(error=>{
            console.log(error)
          })
        })
      })
      /*
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
              //this.photo_prev_list.push(preview_info)

            })
          }
        })
      })

       */
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

  grid-template-columns: repeat(auto-fill,minmax(520px,1fr));
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
.album-text{
  color: black;
  text-transform: capitalize;
  font-family: 'Source Serif Pro', serif;
  font-size: 20px;
  font-weight: 400;
  text-decoration: underline black 1px;
  padding-bottom: 10px;

}
.centered-text{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none;
  text-transform: capitalize;
  color: black;

  font-size: 20px;
  font-weight: 300;
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

    grid-template-columns: repeat(auto-fill,minmax(360px,1fr));
    grid-gap: 15px 15px;

    .centered-text{
      opacity: 0;
    }
    .center-photo{
      border: black solid 1px;

    }
    .photo-overlay{
      width: 100%
    }

  }
}




</style>
