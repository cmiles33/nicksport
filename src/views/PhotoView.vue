<template>
  <div class="photo-view">
    <div v-if="error">
      <div class="title">
        Photo Not found.
      </div>
    </div>
    <div class="photo-container" v-else >

      <the-photo class="photo" :class="{'photo-active': active}" :photo_location="photo_url"></the-photo>
      <div class="previous" @click="getPrevious" >

      </div>
      <div class="next" @click="getNext">

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
      next: [],
      previous: [],
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
    },
    makeList()
    {
      let album_key = this.album_name.toLowerCase() + '/'
      Storage.list(album_key).then(
          result=>{
            result.forEach(photo=>{
              this.album_list.push(photo.key)
              this.makeIndex()
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

.photo-container{
  padding-top: 15px;
  display: grid;
  grid-template-areas: "overlayarea";
  grid-template-columns: 1fr 1fr;


}
.photo {
  grid-area: overlayarea;
  align-self: center;
  justify-self: center;
  width: 90%;
  height: 100%;
  object-fit: cover;
  grid-column: 1/3;
  user-select: none;
  opacity: 0;
  transition: opacity;
  transition-duration: 2s;


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


</style>