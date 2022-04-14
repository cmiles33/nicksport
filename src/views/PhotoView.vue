<template>
  <div class="photo-view">
    <div v-if="error">
      <div class="title">
        Photo Not found.
      </div>
    </div>
    <div class="photo-container" v-else >
        <router-view>
          <the-photo class="photo" :class="{'photo-active': active}" :photo_location="photo_url"></the-photo>
        </router-view>

          <router-link class="previous"  :to=" {name: 'photo.key', params: { album: $route.params.album, key: previous }}">

          </router-link>



        <router-link class="next" :to=" {name: 'photo.key', params: { album: $route.params.album, key: next }}">

        </router-link>
    </div>
    <div class="columns">
      <div class="column ">
        <router-link :to=" {name: 'photo.key', params: { album: $route.params.album, key: previous }}">
          <div class="subtitle has-text-centered link">
              Previous
          </div>
        </router-link>
      </div>
      <div class="column">
          <router-link :to=" {name: 'album.show', params: {slug: $route.params.album}} ">
            <div class="subtitle has-text-centered link">
              View Album
            </div>
          </router-link>
      </div>
      <div class="column">
          <router-link :to=" {name: 'photo.key', params: { album: $route.params.album, key: next }}">
            <div class="subtitle has-text-centered link">
              Next
            </div>
          </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {Storage} from "aws-amplify";
import ThePhoto from "@/components/ThePhoto";
export default {
  name: "PhotoView",
  components: {ThePhoto},
  data()
  {
    return {
      photo_url: '',
      error: false,
      album_name: '',
      photo_name: '',
      // You'll Need a Method to get previous photo
      // And to get the next photo
      next: 'dumb',
      previous: 'dumb',
      album_list: [],
      index: 0,
      active: true,
    }
  },
  mounted()
  {
    this.get_photo()
    this.makeList()

  },
  watch: {
    photo_url()
    {
        this.active = true
    }
  },
  methods: {
    getNext()
    {
      this.active = false;
      console.log("Go Next")
      this.index +=1

      if(this.index === this.album_list.length)
      {
        this.index = 0

        Storage.get(this.album_list[this.index]).then(result=>{

            this.photo_url = result

        })
      }
      else
      {
        console.log(this.album_list[this.index])
        Storage.get(this.album_list[this.index]).then(result=>{
            this.photo_url = result
        })
      }
      this.setNextPrev()

    },
    getPrevious()
    {
      console.log("Go Previous")
      this.active = false
      this.index -=1
      if(this.index < 0)
      {
        this.index = this.album_list.length -1
        Storage.get(this.album_list[this.index]).then(result=>{
          setTimeout(() =>{
            this.photo_url = result
            this.active = true
          }, 2000)
        })
      }
      else
      {
        Storage.get(this.album_list[this.index]).then(result=>{
          setTimeout(() =>{
            this.photo_url = result
            this.active = true
          }, 2000)
        })
      }
      this.setNextPrev()
    },
    makeList()
    {
      let album_key = this.album_name.toLowerCase() + '/'
      Storage.list(album_key).then(
          result=>{
            result.forEach(photo=>{
              this.album_list.push(photo.key)
              this.makeIndex()
              this.setNextPrev()
            })
          }
      )
    },
    makeIndex()
    {
      let counter = 0
      this.album_list.forEach(photo=>{
        if( photo.split('/')[1] === this.photo_name )
        {
          console.log("Index Found: " + counter)
          this.index = counter
        }
        else {
          counter +=1
        }
      })
    },
    setNextPrev()
    {
      if(this.index === this.album_list.length || this.index === this.album_list.length -1)
      {
        this.next = this.album_list[0]
        this.previous = this.album_list[this.index-1]
      }
      else if(this.index === 0)
      {
        this.next = this.album_list[this.index+1]
        this.previous = this.album_list[this.album_list.length-1]
      }
      else
      {
        this.next = this.album_list[this.index+1]
        this.previous = this.album_list[this.index-1]
      }


      try{
        this.next = this.next.split('/')[1]
        this.previous = this.previous.split('/')[1]
      }
      catch{
        console.log("Not ready")
      }
      console.log(this.next)
      console.log(this.previous)

    },
    async get_photo()
    {
      let photo_name = this.$route.params.key
      let album_name = this.$route.params.album
      this.album_name = album_name
      this.photo_name = photo_name
      let photo_key = album_name + '/' + photo_name
      console.log(photo_key)
      Storage.get(photo_key.toString(),).then(result=>{
        console.log(result)
        this.photo_url = result
      }).catch(error=>{
        this.error = true
        console.log("Photo Not found.")
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300&display=swap');

.photo-container{
  padding-top: 15px;
  display: grid;
  grid-template-areas: "overlayarea";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(810px, auto);



}
.photo {
  grid-area: overlayarea;
  align-self: center;
  justify-self: center;
  width: 78%;
  height: 100%;
  object-fit: cover;
  grid-column: 1/3;
  user-select: none;
  opacity: 0;
  transition: opacity 1s ease-in-out;



}

.photo-active{
  opacity: 100%;
}

@keyframes fadein{
  from{
    opacity: 100%;
  }
  to{
    opacity: 0
  }
}

.next{
  grid-area: overlayarea;

  grid-column: 2/3;
  cursor: e-resize;
}
.previous{
  grid-area: overlayarea;
  grid-column: 1/2 ;
  cursor: w-resize;
}

.link{
  font-family: "DejaVu Sans";
  color: black;
  text-decoration: none;
  transition: all 0.5s ease-out;

}
.link a{
  font-family: "DejaVu Sans";
  color: black;
  text-decoration: none;
  transition: all 0.5s ease-out;
}
.link a:hover{
  color: white;
  background: black;
  border: white solid 2px;
}



.subtitle{
  font-family: 'Source Serif Pro', serif;
}
@media Screen and (max-width: 700px)
{
  .photo-container{

    grid-template-rows: minmax(150px, auto);



  }
}

</style>