<template>
  <transition name="fade">
    <div class="album-view">
      <div v-if="error">
        <div class="title">
          No Album Found.
        </div>
      </div>
      <div v-else class="album-container">
        <div v-for="photo in photos" :key="photo">
          <router-link :to=" {name: 'photo.key', params: { album: photo[0][0], key: photo[0][1] }} ">
            <div class="album-photo">
              <img :src="photo[1]" alt="Whoops...">
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

import {Storage, API, graphqlOperation} from "aws-amplify";
import {listAlbums} from "@/graphql/queries";

export default {
  name: "AlbumView",
  data()
  {
    return{
      album: '',
      photos: [],
      error: false,
    }

  },
  mounted()
  {
    this.get_photos()
  },
  methods: {
    async get_photos()
    {
      let album_name = this.$route.params.slug
      album_name = album_name.toLowerCase()
      let albums = await API.graphql(graphqlOperation(listAlbums))
      const albums_objects = albums.data.listAlbums.items
      albums_objects.forEach(result=>{
        if(result.name === album_name)
        {
          let photos = result.photos.items
          photos.forEach(photo=>{
            let info = []
            let linkInfo = []
            linkInfo.push(album_name)

            //console.log(photo.photo_key)
            linkInfo.push(photo.photo_key.split('/')[1])
            info.push(linkInfo)
            Storage.get(photo.preview_key).then(photo_url=>{
              info.push(photo_url)
              this.photos.push(info)
            })
          })
        }
      })

      /*
      //let album_key = album.toLowerCase() + '/'
      Storage.list(album_key)
      .then(result =>{
        if(result.length === 0)
        {
          this.error = true
        }
        else{
          result.forEach(photo=>{
            let info = []
            let linkInfo = []
            linkInfo.push(photo.key.split('/')[0])
            linkInfo.push(photo.key.split('/')[1])
            info.push(linkInfo)
            Storage.get(photo.key).then(photo_url=>{
              info.push(photo_url)
              this.photos.push(info)
            })
          })
        }

      })

       */

      this.album = album_name

    }
  }

}
</script>

<style scoped>


.album-container{
  padding-top: 15px;
  display: grid;

  grid-template-columns: repeat(auto-fill,minmax(350px,1fr));
  grid-gap: 15px 15px;
  transition: all 1s ease-in-out;

}
.album-container >div
{

}
.album-container >div:nth-child(odd)
{

}
.album-photo{
  width:100%;
  height: 100%;
  object-fit: scale-down;
  transition: 0.5s ease transform;
}
.album-photo:hover{
  box-shadow: 0 0 10px lightgrey;
  transform: scale(1.03);
}




</style>