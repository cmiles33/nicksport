/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAlbum = /* GraphQL */ `
  query GetAlbum($id: ID!) {
    getAlbum(id: $id) {
      id
      name
      album_cover
      photos {
        items {
          id
          title
          photo_key
          preview_key
          createdAt
          updatedAt
          albumPhotosId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAlbums = /* GraphQL */ `
  query ListAlbums(
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlbums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        album_cover
          photos {
              items {
                  id
                  title
                  photo_key
                  preview_key
                  createdAt
                  updatedAt
                  albumPhotosId
              }
              nextToken
          }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPhoto = /* GraphQL */ `
  query GetPhoto($id: ID!) {
    getPhoto(id: $id) {
      id
      title
      photo_key
      preview_key
      createdAt
      updatedAt
      albumPhotosId
    }
  }
`;
export const listPhotos = /* GraphQL */ `
  query ListPhotos(
    $filter: ModelPhotoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        photo_key
        preview_key
        createdAt
        updatedAt
        albumPhotosId
      }
      nextToken
    }
  }
`;
