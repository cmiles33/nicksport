<template>
  <div class="my-container">
    <div class="mynav">
      <TheNavBar/>
    </div>
    <div class="main-view">
      <router-view v-slot="{Component, route}">
        <transition :name="route.meta.transition || 'fade'">
          <component :is="Component" :key="route.path"/>
        </transition>
      </router-view>
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
  components: {TheNavBar, TheFooter},

}
</script>

<style lang="scss">

.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;

}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  position: absolute;
  transform: translateX(200%);
}

.real-enter-active,
.real-leave-active{
  transition: all 2s ease;
}

.real-enter-from,
.real-leave-to{
  opacity: 0;
  position: absolute;
  transform: translatex(5%);
}

.my-container{
  display: grid;
  //grid-template-columns: 70% 30% ;
  // These are fractional tings
  // grid-template-columns: repeat(4,1fr) Ect
  grid-template-columns: 1fr 2fr 2fr 1fr;
  grid-auto-rows: minmax(70px, auto);
  //grid-auto-rows: 100px;
  //grid-column-gap: 1em;
  //grid-row-gap: 1em;
  grid-gap: 2em;

}
.mynav{

  grid-column: 1;
  grid-row: 1/7;
  padding-top: 15px;
  border-right: black solid 2px;
}
.main-view{
  grid-column-start: 2;
  grid-column-end: 5;
  grid-row: 1/7;
  padding-right: 20px;
}
.myfooter{
  grid-column: 1/5;
  grid-row: 7;
}

.my-container >div{

}
.my-container >div:nth-child(odd)
{

}
@media screen and (max-width: 700px)
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
    border-right: none;
  }
  .main-view{
    grid-column: 1;
    grid-row: 2/7;
    padding: 10px 10px;
  }
  .myfooter{
    grid-column: 1;
    grid-row: 7;

  }

}

@import '../node_modules/bulma';
</style>
