import '../Styles/styles.css'
import NavBar from "../Components/Navbar";
import '../Styles/home.css'
import {useEffect, useState} from "react";
import {getDownloadURL, listAll, ref} from "@firebase/storage";
import {storage} from "../Utils/config";
import {ContactBar} from "../Components/ContactBar";

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const listRef = ref(storage, "Home")

    setPhotos([])
    listAll(listRef)
      .then(res => {
        res.items.forEach((folderRef) => {
          getDownloadURL(folderRef)
            .then(url => {
              setPhotos(prevState => [
                ...prevState,
                url
              ])
            })
        })
      })
      .catch((e) => {
        console.error(e)
      })
  }, []);


  return (
    <div className={"body"}>
    <NavBar/>
      <div className={"grid-home"}>
        <div className={"top-left-comment"}>
          When the planet trembles for atlantis tower, all klingons assimilate clear, brave lieutenant commanders.Nunquam attrahendam abactor.
        </div>
        <div className={"photo-in-grid-home bottom-left-photo"}>
          <img src={photos[1]} alt={""}/>
        </div>
        <div className={"photo-in-grid-home photo-center"}>
          <img src={photos[2]} alt={""}/>
        </div>
        <div className={"photo-in-grid-home top-right-photo"}>
          <img src={photos[0]} alt={""}/>
        </div>
        <div className={"bottom-right-comment"}>
          When the planet trembles for atlantis tower, all klingons assimilate clear, brave lieutenant commanders.Nunquam attrahendam abactor.
        </div>
      </div>
      <ContactBar/>
    </div>

  )
}