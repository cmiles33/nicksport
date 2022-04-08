<template>
  <div class="nav-container">
    <div class="brand">
      <div class="title">
        My Website.
      </div>
    </div>
    <div class="links">
      <div class="link" v-for="album in album_list" :key="album">
        <router-link :to=" {name: 'album.show', params: {slug: album}} ">
          {{album}}
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import {Storage} from "aws-amplify";


export default {
  name: "TheNavBar",
  data(){
    return{
      album_list: new Set(),
    }
  },
  mounted(){
    this.getAlbumList()
  },
  methods:
  {
    async getAlbumList()
    {
      //let folders = []
      Storage.list('').then(results=>{
        results.forEach(result=>{
          let folder = result.key.split('/').slice(0,-1)[0]
          if(!this.album_list.has(folder))
          {
            this.album_list.add(folder)
          }
        })
      })
    },
  }

}
</script>

<style scoped>

.nav-container{
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(50px, auto);

}

.brand{
  justify-self: center;
}
.links{
  justify-self: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
}
.link{
  font-family: "DejaVu Sans";

}
.title{
  font-size: 50px;
  font-family: Roboto,serif;
}


</style>