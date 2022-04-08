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
          <router-link :to=" {name: 'photo.show', params: { album: photo[0][0], key: photo[0][1] }} ">
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

import {Storage} from "aws-amplify";

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
      let album = this.$route.params.slug
      let album_key = album.toLowerCase() + '/'
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

      this.album = album

    }
  }

}
</script>

<style scoped>


.album-container{
  padding-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: minmax(100px, auto);
  grid-gap: 15px 15px;

}
.album-container >div
{
  background: grey;
}
.album-container >div:nth-child(odd)
{
  background: darkgrey;
}
.album-photo{
  width:100%;
  height: 100%;
  object-fit: scale-down;
}
@media screen and (max-width:1400px)
{
  .album-container{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: minmax(100px, auto);
    grid-gap: 5px;

  }
}
@media screen and (max-width:900px)
{
  .album-container{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: minmax(100px, auto);
    grid-gap: 5px;


  }
}
@media screen and (max-width:500px)
{
  .album-container{
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(100px, auto);
    grid-gap: 5px;

  }
}



</style>