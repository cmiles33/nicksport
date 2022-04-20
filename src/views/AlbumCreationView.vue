<template>
  <div class="create-container" @dragover.prevent @drop.prevent>
    <div class="album-container">
      <div class="drop-zone" @drop="onFileDrop"  >
        <h1 class="title">
          Drag photos here for upload
          <br>
          (or anywhere in the preview area)
        </h1>
        <h1 v-if="upload_percent !== 0" class="title is-info">
          Upload Percent: {{upload_percent * 100}}%
        </h1>
      </div>
      <div class="preview-area"  @drop="onFileDrop">
        <div class="preview-photos">
            <div  v-for="files in file_preview"
                  :key="files">
                <img alt="Whoops...." :key="files" class="preview-photo" :src="files">
            </div>
        </div>
      </div>
      <div class="selection-area">
        <div :class="{ has_background_danger: danger_var}" class="selection-container">
          <div>
            <button class="button is-fullwidth is-info" @click="uploadList">
              Upload Selected photos
            </button>
          </div>
          <div>
            <select class="select is-fullwidth" v-model="album_selected">
              <option v-for="album in album_list" :value="album" :key="album">
                {{album.name}}
              </option>
            </select>
            <p v-if="album_selected.name === ''" class="subtitle is-danger">Please Select Album</p>
            <p v-else class="subtitle is-primary">
              {{album_selected.name}}: Is your selection.
            </p>
          </div>
          <div>
            <button class="button is-fullwidth is-danger" @click="clearList">
              Clear All Selected Photos
            </button>
            <button v-if="album_selected.name !==''"  class="button is-fullwidth is-dark my-3" @click="deleteAlbum">
              Delete Album
            </button>
          </div>
          <div class="input-area">
            <p>
              View Name: <span class="is-success">{{new_album.toUpperCase()}}</span>
            </p>
            <p>
              Album Name: <span class="is-text ">{{new_album.replaceAll(' ', '_').toLowerCase()}}</span>
            </p>
            <p>Must only contain spaces and letters</p>
            <input class="input is-fullwidth has-text-centered my-3" v-model="new_album">
            <button class="button is-fullwidth is-primary" @click="addNewAlbum">
              Add New Album
            </button>
            <div v-if="delete_list.size === 0 && album_preview.length !==0">
              <p class="has-text-danger-dark"> If you want to select photos to delete, click on a photo below.</p>
            </div>
            <div v-else-if="delete_list.size !==0">
              <p> You have selected {{delete_list.size}} photos to remove.</p>
              <button class="button is-fullwidth is-danger" @click="deleteSelection">
                Delete Selected Photos!
              </button>
            </div>

          </div>
          <div v-if="album_selected.name !== '' ">
            <p class="title is-centered">
              Current Photos Below:
            </p>
          </div>
        </div>
      </div>
      <div class="preview-album">
        <div class="preview-album-container">
          <div v-for="preview in album_preview" :key="preview.id"  class="album-photo">
            <img alt="Whoops....." :src="preview[1]" @click="deleteSelect($event,preview[0])" >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {Storage, API, graphqlOperation} from "aws-amplify";
import {deleteAlbum, createAlbum, createPhoto, deletePhoto } from "@/graphql/mutations";
import {getAlbum, } from "@/graphql/queries";
import {listAlbums, listPhotos} from "@/graphql/queries";

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


export default {
  name: "AlbumCreationView",

  data()
  {
    return{
      album_selected: {},
      new_album: '',
      filename: '',
      file: '',
      files_to_upload: [],
      previews_to_upload: [],
      file_preview: [],
      album_list: new Set(),
      album_preview: [],
      upload_percent: 0,
      danger_var: false,
      delete_list: new Set(),
      current_file_name: ''
    }
  },
  mounted() {
    //this.getList()
    this.getAlbumList()
    //this.testApi()


    // Get list of Albums from database or S3

  },
  watch:{
    album_selected()
    {
      if(this.album_selected === '')
      {
        console.log("No Album No problems")

      }
      else{
        // Try to get photos from S3
        console.log(this.album_selected)
        console.log("Uploading Album Preview....")
        //this.getPhotosApi()
        this.delete_list.clear()
        this.getAlbumPhotos()
      }
    },
    upload_percent(){
      if (this.upload_percent === 100)
      {
        this.getAlbumPhotos()
        this.danger_var = false
      }
      else
      {
        this.danger_var = true
      }
    }
  },

  methods: {
    deleteSelect(event, key)
    {
      //console.log(key)

      if(!this.delete_list.has(key))
      {
        this.delete_list.add(key)
        event.target.classList.add('big-danger')
      }
      else if(this.delete_list.has(key))
      {
        event.target.classList.remove('big-danger')
        this.delete_list.delete(key)
      }
      //console.log(this.delete_list)
    },
    deleteSelection()
    {
      if(this.delete_list.size === 0)
      {
        console.log("Error....")
      }
      else
      {
        this.delete_list.forEach(photo=>{
          /*
          console.log(photo)
          console.log(photo.photo_key)
          console.log(photo.preview_key)
          console.log(photo.id)

           */
          Storage.remove(photo.photo_key).catch(error=>{
            console.log(error)
          })
          Storage.remove(photo.preview_key).catch(error=>{
            console.log(error)
          })
          API.graphql(graphqlOperation(deletePhoto, {input: {id: photo.id}})).catch(error=>{
            console.log(error)
          })
          this.delete_list.delete(photo)
          /*
          console.log(this.delete_list)
          console.log("This was Deleted: " + photo)

           */

        })
        setTimeout(()=>{
          this.getAlbumList()
          this.getAlbumPhotos()
        },1000)

      }
    },
    async deleteAlbum()
    {
      //console.log(this.album_selected.id)
      await API.graphql(graphqlOperation(getAlbum,{id: this.album_selected.id})).then(album=>{
        let photos = album.data.getAlbum.photos.items
        //console.log(photos)
        photos.forEach(photo=>{
          //console.log(photo)
          Storage.remove(photo.photo_key).catch(error=>{
            console.log(error)
          })
          Storage.remove(photo.preview_key).catch(error=>{
            console.log(error)
          })
          API.graphql(graphqlOperation(deletePhoto, {input: {id: photo.id}})).then( ()=>{
            API.graphql(graphqlOperation(deleteAlbum, {input: {id: this.album_selected.id}})).then(()=>{
                  this.getAlbumList()
                  this.album_preview = []
                }
            ).catch(error=>{
              console.log(error)
            })
          }).catch(error=>{
            console.log(error)
          })
        })
      })



    },
    async getAlbumPhotos()
    {
        this.album_preview = []
        //console.log("API Getting Previews....")
        let album = await API.graphql(graphqlOperation(getAlbum,{id: this.album_selected.id}))
        let photos = album.data.getAlbum.photos.items
        photos.forEach( photo =>{
          let photo_info = []
          photo_info.push(photo)
          Storage.get(photo.preview_key).then( myurl=>{
            photo_info.push(myurl)
            this.album_preview.push(photo_info)
          })
        })

    },
    async getAlbumList()
    {
      this.album_list.clear()
      this.album_selected.name = ''
      API.graphql(graphqlOperation(listAlbums)).then(result=>{
        const albums = result.data.listAlbums.items
        albums.forEach(album=>{
          this.album_list.add(album)
          //console.log(album)
        })
      })
    },
    async uploadList()
    {

      //console.log("Uploading List of Files")
      if(this.album_selected.name === '')
      {
        console.log("no Album selected.....")
        alert("No Album Selected..")
      }
      else{
        if(this.files_to_upload.length === 0)
        {
          console.log("Files is empty")
        }
        else {
          console.log("Start Uploading")

          this.files_to_upload.forEach( (file, index )=>{
            //console.log(file)
            let preview = this.previews_to_upload[index]
            let folder_path = this.album_selected.name + '/'
            //console.log("Folder Path: " + folder_path)
            this.uploadS3(file, folder_path, preview)


          })
          //this.files_to_upload = []
          //this.file_preview = []
          // Call Function For new Album Preview.

          await this.getAlbumList()
          await this.getAlbumPhotos()

        }
      }
    },
    async uploadS3(file, folder, preview)
    {
      //console.log(folder)
      try {
        let name = folder + 'hero'+ file.name.hashCode().toString()
        let preview_name = folder + 'preview/' + 'hero' + preview.name.hashCode().toString()
        //console.log(preview_name)
        const progressCallback = (progress) =>{
          this.upload_percent = progress.loaded / progress.total

        }
        await Storage.put(name, file,  {
          contentType: "image/png", // contentType is optional
          progressCallback
        }).then( results=>{
          //console.log(results.key)
          let key = results.key

          Storage.put(preview_name, preview, {
            contentType: "image/png"
          }).then(prev_results=>{
            let prev_key = prev_results.key

            API.graphql(
                {
                  query: createPhoto,
                  variables:{input:
                        {
                          title: name,
                          albumPhotosId: this.album_selected.id,
                          photo_key: key,
                          preview_key: prev_key
                        }}})
          })
          console.log("Upload Complete")
          this.files_to_upload.pop()
          this.previews_to_upload.pop()
          this.file_preview.pop()
        });
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    },
    async onFileDrop(e)
    {

      function calculateSize(img, maxWidth, maxHeight) {
        let width = img.width;
        let height = img.height;
        // calculate the width and height, constraining the proportions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        return [width, height];
      }

      const bobcallback = (blob) =>{
        blob.name = this.current_file_name
        //console.log(blob)
        this.previews_to_upload.push(blob)
        this.files_to_upload.push(blob)
        const objectURL = window.URL.createObjectURL(blob)
        this.file_preview.push(objectURL)
        //console.log("Compressed Photo")
      }



      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      const MIME_TYPE = "image/jpeg";
      const QUALITY = .90;

      //console.log(e)
      console.log("Oh heeee done dropping")
      e.preventDefault()
      if(e.dataTransfer.items)
      {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            let file = e.dataTransfer.items[i].getAsFile();
            //this.files_to_upload.push(file)
            this.current_file_name = file.name
            /*
            const objectURL = window.URL.createObjectURL(file)
            this.file_preview.push(objectURL)

             */
            //console.log(this.files_to_upload)
            //console.log(file)
            //console.log('... file[' + i + '].name = ' + file.name);
            const blobURL = URL.createObjectURL(file)
            const img = new Image()
            img.src = blobURL
            img.onerror = function(){
              URL.revokeObjectURL(this.src)
              console.log("Cannot load Image....")
            }
            img.onload = function () {
              URL.revokeObjectURL(this.src);
              const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
              const canvas = document.createElement("canvas");
              canvas.width = newWidth;
              canvas.height = newHeight;

              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              canvas.toBlob(
                  bobcallback,
                  MIME_TYPE,
                  QUALITY
              );

            };

          }
        }
      }
      else {
        // Use DataTransfer interface to access the file(s)

        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
        }


      }
    },
    async addNewAlbum()
    {
      let new_album = this.new_album
      // Do Checks
      new_album = new_album.replaceAll(' ','_').toLowerCase()
      //console.log("Here is new album:" + new_album)
      API.graphql(graphqlOperation(createAlbum, {input: { name: new_album}})).then(results=>{
        //console.log(results.data.createAlbum)
        this.album_list.add(results.data.createAlbum)
        this.album_selected = results.data.createAlbum
        this.new_album = ''
      })

    },
    clearList()
    {
      this.files_to_upload = []
      this.file_preview = []
      this.previews_to_upload = []
    },
    async testApi()
    {

      //API.graphql(graphqlOperation(createAlbum, {input: first_album}))
      console.log("Tried to Create Album.")
      API.graphql(graphqlOperation(listAlbums)).then(result=>{
        const photos = result.data.listAlbums.items
        photos.forEach(album=>{
          API.graphql(graphqlOperation(deleteAlbum, {input: {id: album.id}}))
        })

      })
      API.graphql(graphqlOperation(listPhotos)).then(result=>{
        const photos = result.data.listPhotos.items
        photos.forEach(photo=>{
          API.graphql(graphqlOperation(deletePhoto, {input: {id: photo.id}})).catch(error=>{
            console.log(error)
          })
        })
      })
    },
    async getPhotosApi()
    {
      const album = await API.graphql(graphqlOperation(getAlbum,{id: this.album_selected.id}))
      console.log(album)
      let photos = album.data.getAlbum.photos.items
      photos.forEach( photo =>{
        console.log(photo)
      })
    }
  },


}
</script>

<style lang="scss" scoped>


.album-container
{
  padding-top: 10px;
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(100px, auto);
  text-align: center;
  color: white;

}
.drop-zone{
  border: 2px dashed black;
  background: lightgrey;
  grid-column: 1/4;
  grid-row: 1;
}
.preview-area{
  border: 3px solid black;
  grid-column: 1/4;
  grid-row: 2/5;
  background: lightgrey;
}
.preview-photos{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  grid-gap: 20px 20px;

}
.preview-photos >div:nth-child(odd)
{
  background: grey;
}
.preview-photos >div{
  background: darkgrey;
}

.preview-photo{
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

.selection-area
{
  grid-column: 1/4;
  grid-row: 5/6;


}
.selection-container{
  border: black solid 2px;
  padding: 5px 5px 5px 5px;
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 30px;
  grid-gap: 50px 50px;

}
.input-area{
  color: black;
  grid-column: 1;
  grid-row: 2;
  align-self: start;
}

.preview-album{
  border: black solid 2px;
  grid-column: 1/4;
  grid-row: 6/8;

}
.preview-album-container{
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: minmax(100px, auto);
  grid-gap: 10px 10px;
}
.album-photo{
  width: 100%;
  height: 100%;
  object-fit: scale-down;

}
.big-danger{
  border: darkred 10px solid;
  box-shadow: 0 0 10px firebrick;
  opacity: 80%;
}

</style>