<template>
  <div class="my-container">
    <div class="mynav">
      <TheNavBar/>
    </div>
    <div class="main-view">
      <router-view/>
    </div>
    <div class="myfooter">
      <TheFooter/>
    </div>
  </div>
</template>

<script>

import TheFooter from "@/components/TheFooter";
import TheNavBar from "@/components/TheNavBar";

export default{
  components: {TheNavBar, TheFooter}
}
</script>

<style lang="scss">
.my-container{
  display: grid;
  //grid-template-columns: 70% 30% ;
  // These are fractional tings
  // grid-template-columns: repeat(4,1fr) Ect
  grid-template-columns: 1fr 2fr 2fr 1fr;
  grid-auto-rows: minmax(50px, auto);
  //grid-auto-rows: 100px;
  //grid-column-gap: 1em;
  //grid-row-gap: 1em;
  grid-gap: 2em;

}
.mynav{
  grid-column: 1;
  grid-row: 1/7;
}
.main-view{
  grid-column-start: 2;
  grid-column-end: 5;
  grid-row: 1/7;
}
.myfooter{
  grid-column: 1/5;
  grid-row: 7;
}

.my-container >div{

}
.my-container >div:nth-child(odd)
{
  background: aqua;
}
@media screen and (max-width: 500px)
{
  .my-container{
    display: grid;
    grid-template-columns: 1fr ;
    grid-auto-rows: minmax(100px, auto);
    grid-gap: 2em;

  }
  .mynav{
    grid-column: 1;
    grid-row: 1;
  }
  .main-view{
    grid-column: 1;
    grid-row: 2/7
  }
  .myfooter{
    grid-column: 1;
    grid-row: 7;

  }
}
</style>
