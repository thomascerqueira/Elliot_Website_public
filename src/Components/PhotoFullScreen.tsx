import {Photo} from "./PhotoGrid";
import '../Styles/photoFullscreen.css'

interface Props {
  photo: Photo,
  setPhoto: any
}

export default function PhotoFullScreen(
  {
    photo,
    setPhoto,
  }: Props
) {
  return (
    <div
      className={"photo-fullscreen"}
      onClick={() => {
        setPhoto(null)
    }}>
      <img
        src={photo.photo}
        alt={""}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          window.open(photo.photo)
        }}/>
      <div
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}>
        {
          photo.desc
        }
      </div>
    </div>
  )
}