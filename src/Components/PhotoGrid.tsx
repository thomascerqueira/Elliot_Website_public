import {useState} from "react";
import '../Styles/photoContainer.css'
import PhotoFullScreen from "./PhotoFullScreen";

export interface Photo {
  photo: string,
  desc: string
}

interface Props {
  photos: {
    photo: string,
    desc: string
  }[]
}

export default function PhotoGrid(
  {
    photos
  }: Props
) {
  const [photoFullscreen, setPhotoFullscreen] = useState<Photo | null>(null);

  return (
    <div className={"grid-image"}>
      {
        photos.map(photo => {
          return (
            <div className={"photo-container"}>
              <img alt={photo.photo} src={photo.photo} onClick={() => {
                setPhotoFullscreen(photo)
              }
              }/>
            </div>
          )
        })
      }
      {
        photoFullscreen &&
        <PhotoFullScreen photo={photoFullscreen} setPhoto={setPhotoFullscreen}/>
      }
    </div>
  )
}