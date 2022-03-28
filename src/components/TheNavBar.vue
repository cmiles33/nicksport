<template>
  <div class="nav-container">
    <div class="brand">
      <div class="title">
        My Website.
      </div>
    </div>
    <div class="links">
      <div class="link">
        <a>My Link</a>
      </div>
      <div class="link">
        <a>My Link</a>
      </div>
      <div class="link">
        <a>My Link</a>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "TheNavBar"
}
</script>

<style scoped>

.nav-container{
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(50px, auto);

}

.brand{
  justify-self: center;
}
.links{
  justify-self: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
}
.link{
  font-family: "DejaVu Sans";

}
.title{
  font-size: 50px;
  font-family: Roboto,serif;
}


</style>