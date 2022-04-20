<template>
  <div class="nav-container">
    <div class="brand">
      <router-link :to=" {name: 'home'} ">
        <div class="title">
          HeroOfNow
        </div>
      </router-link>
    </div>
    <div class="links">
      <div class="link" v-for="album in album_list" :key="album">
        <router-link :to=" {name: 'album.show', params: {slug: album.name}} ">
          {{album.name.replaceAll('_',' ') }}
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import {API, graphqlOperation} from "aws-amplify";
import {listAlbums} from "@/graphql/queries";

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
      API.graphql(graphqlOperation(listAlbums)).then(result=>{
        const albums = result.data.listAlbums.items
        albums.forEach(album=>{
          this.album_list.add(album)
        })
      })
      /*
      Storage.list('').then(results=>{
        results.forEach(result=>{
          let folder = result.key.split('/').slice(0,-1)[0]
          if(!this.album_list.has(folder))
          {
            this.album_list.add(folder)
          }
        })
      })
       */
    },
  }

}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300&display=swap');

.nav-container{
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(180px,1fr));
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
  padding-left: 10px;
}
.link a{
  font-family: 'Source Serif Pro', serif;
  font-weight: 200;
  text-transform: capitalize;
  color: black;
  text-decoration: none;
  font-size: large;
  flex: 1;
  transition: all 0.5s ease-out;

}
.link a:hover{
  color: white;
  background: black;
  padding: 4px 4px 4px 4px;
  border: white solid 2px;
}



.title{
  font-size: 30px;
  font-family: 'Source Serif Pro', serif;

}

@media Screen and (max-width: 700px)
{
  .brand{
    border-right: black solid 2px;
    padding-right: 10px;
  }
  .title{
    padding-top: 50px;
  }
}


</style>