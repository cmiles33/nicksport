import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView";
import AlbumCreationView from "@/views/AlbumCreationView";
import AlbumView from "@/views/AlbumView";
import PhotoView from "@/views/PhotoView";
import ThePhoto from "@/components/ThePhoto";
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,

  },
  {
    path: '/login',
    name: 'log_in',
    component: LoginView,

  },
  {
    path: '/create',
    name: 'create_album',
    component: AlbumCreationView,

  },
  {
    path: '/album/:slug',
    name: 'album.show',
    component: AlbumView,

  },
  {
    path: '/album/:album/photo',
    name: 'photo.show',
    component: PhotoView,
    meta: {transition: 'real'},
    children:[
      {
        path: ':key',
        name: 'photo.key',
        component: ThePhoto,
        meta: {transition: 'real'}
      }
    ]

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
