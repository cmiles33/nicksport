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
                {{album}}
              </option>
            </select>
            <p v-if="album_selected === ''" class="subtitle is-danger">Please Select Album</p>
            <p v-else class="subtitle is-primary">
              {{album_selected}}: Is your selection.
            </p>
          </div>
          <div>
            <button class="button is-fullwidth is-danger" @click="clearList">
              Clear All Selected Photos
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
          <div v-if="album_selected !== '' ">
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

import {Storage} from "aws-amplify";

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
      album_selected: '',
      new_album: '',
      filename: '',
      file: '',
      files_to_upload: [],
      file_preview: [],
      album_list: new Set(),
      album_preview: [],
      upload_percent: 0,
      danger_var: false,
      delete_list: new Set(),

    }
  },
  mounted() {
    //this.getList()
    this.getAlbumList()
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
      console.log(key)

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
      console.log(this.delete_list)
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
          Storage.remove(photo).then( results=>{
            console.log(results)
            console.log("delted Succ.")
          })
          this.delete_list.delete(photo)
          console.log(this.delete_list)
          console.log("This was Deleted: " + photo)

        })
        setTimeout(()=>{
          this.getAlbumList()
          this.getAlbumPhotos()
        },1000)

      }
    },

    async getAlbumPhotos()
    {
      let album_key = this.album_selected
      this.album_preview = []
      album_key = album_key + '/'
      Storage.list(album_key)
          .then(result=>{

            //console.log(result)
            result.forEach(pictures =>{
              let photo_info = []
              photo_info.push(pictures.key)
              Storage.get(pictures.key).then( myurl=>{
                    //console.log(myurl)
                photo_info.push(myurl)
                    this.album_preview.push(photo_info)
              })

            })
          })
          .catch(err =>{
            console.log(err)
          })
    },
    async getAlbumList()
    {
      //let folders = []
      setTimeout(()=>{
        this.album_list.clear()
        Storage.list('').then(results=>{
          results.forEach(result=>{
            let folder = result.key.split('/').slice(0,-1)[0]
            if(!this.album_list.has(folder))
            {
              this.album_list.add(folder)
            }
          })
        })
      },500)
    },
    async uploadList()
    {
      console.log("Uploading List of Files")
      if(this.album_selected === '')
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
          this.files_to_upload.forEach( file=>{
            console.log(file)
            let folder_path = this.album_selected + '/'
            console.log("Folder Path: " + folder_path)
            this.uploadS3(file, folder_path)
          })
          //this.files_to_upload = []
          //this.file_preview = []
          // Call Function For new Album Preview.
          await this.getAlbumList()
          await this.getAlbumPhotos()
        }
      }
    },
    async uploadS3(file,folder)
    {
      console.log(folder)
      try {
        let name = folder + 'hero'+ file.name.hashCode().toString()
        const progressCallback = (progress) =>{
          this.upload_percent = progress.loaded / progress.total

        }
        await Storage.put(name, file,  {
          contentType: "image/png", // contentType is optional
          progressCallback
        }).then( results=>{
          console.log(results.key)
          console.log("Upload Complete")
          this.files_to_upload.pop()
          this.file_preview.pop()
        });

      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    },
    async onFileDrop(e)
    {
      console.log(e)
      console.log("Oh heeee done dropping")
      e.preventDefault()
      if(e.dataTransfer.items)
      {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            let file = e.dataTransfer.items[i].getAsFile();
            this.files_to_upload.push(file)
            const objectURL = window.URL.createObjectURL(file)
            this.file_preview.push(objectURL)
            console.log(this.files_to_upload)
            console.log(file)
            console.log('... file[' + i + '].name = ' + file.name);
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
    addNewAlbum()
    {
      let new_album = this.new_album
      // Do Checks
      new_album = new_album.replaceAll(' ','_').toLowerCase()
      console.log("Here is new album:" + new_album)
      this.album_list.add(new_album)
      this.album_selected = new_album
      this.new_album = ''
    },
    clearList()
    {
      this.files_to_upload = []
      this.file_preview = []
    },
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