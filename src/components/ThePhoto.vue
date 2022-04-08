<template>
  <div class="the-photo">
      <img :src="photo_location">
  </div>
</template>

<script>
export default {
  name: "ThePhoto",
  props:{
    photo_location: String
  }
}
</script>

<style>

</style>