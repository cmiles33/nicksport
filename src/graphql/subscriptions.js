/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum {
    onCreateAlbum {
      id
      name
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum {
    onUpdateAlbum {
      id
      name
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum {
    onDeleteAlbum {
      id
      name
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
export const onCreatePhoto = /* GraphQL */ `
  subscription OnCreatePhoto {
    onCreatePhoto {
      id
      title
      album {
        id
        name
        photos {
          nextToken
        }
        createdAt
        updatedAt
      }
      photo_key
      preview_key
      createdAt
      updatedAt
      albumPhotosId
    }
  }
`;
export const onUpdatePhoto = /* GraphQL */ `
  subscription OnUpdatePhoto {
    onUpdatePhoto {
      id
      title
      album {
        id
        name
        photos {
          nextToken
        }
        createdAt
        updatedAt
      }
      photo_key
      preview_key
      createdAt
      updatedAt
      albumPhotosId
    }
  }
`;
export const onDeletePhoto = /* GraphQL */ `
  subscription OnDeletePhoto {
    onDeletePhoto {
      id
      title
      album {
        id
        name
        photos {
          nextToken
        }
        createdAt
        updatedAt
      }
      photo_key
      preview_key
      createdAt
      updatedAt
      albumPhotosId
    }
  }
`;
