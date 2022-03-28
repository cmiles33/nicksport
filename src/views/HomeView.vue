<template>
  <div class="main-window">
    <div class="center-photo">

        <img class="photo" src="https://southamericatourism.com/wp-content/uploads/2018/08/PAT_1400x1000_EcoCamp6.jpg">

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
    //HelloWorld
  },
  data()
  {
    return{
      testing: []
    }
  },
  mounted(){
    this.testApi()
    this.printApi()
  },
  methods: {
    printApi()
    {
      this.testing.forEach(entry=>{
        console.log(entry)
      })
    },
    testApi()
    {
      axios.get('https://05eit33n6k.execute-api.us-east-2.amazonaws.com/Prod/')
      .then(response =>{
        this.testing = response.data
      })
      .catch(error =>{
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss">
.main-window{
  display: grid;
  background: blue;
  grid-template-columns: 1fr 1fr 1fr ;
  grid-auto-rows: minmax(100px, auto);

}
.main-window >div{
  background: darkgrey;
}
.main-window >div:nth-child(odd)
{
  background: grey;
}

.center-photo{
  grid-column: 1/4;
  grid-row: 1/5;
  justify-self: end;

}

.center-photo>img{
  object-fit: cover;
  width: 75%;
  height: auto;
  max-height: 100%;
  padding-left: 10px;
  padding-top: 10px;
}
@media screen and (max-width:900px)
{
  .center-photo>img{
    object-fit: cover;
    width: 95%;
    height: auto;
    max-height: 100%;
    padding-left: 10px;
    padding-top: 10px;
  }
}




</style>
