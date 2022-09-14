import React, {useEffect, useState} from 'react';
import "../Styles/container.css"
import "../Styles/error.css"
import '../Styles/styles.css'
import '../Styles/login.css'
import {collection, getDocs} from "@firebase/firestore";
import {db, storage} from "../Utils/config";
import {getDownloadURL, listAll, ref} from "@firebase/storage";
import {ContactBar} from "../Components/ContactBar";

export default function Login() {
  const [Id, setId] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [imageBackground, setImageBackground] = useState<string[]>([]);

  useEffect(() => {
    const listRef = ref(storage, "Background")

    setImageBackground([])
    listAll(listRef)
      .then(res => {
        res.items.forEach((folderRef) => {
          getDownloadURL(folderRef)
            .then(url => {
              setImageBackground(prevState => [
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


  useEffect(() => {
    if (localStorage.getItem("username")) {
      getDocs(collection(db, "Users"))
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id === localStorage.getItem("username")) {
              window.location.href = "/Home"
            }
          });
        })
    }
  }, []);

  async function connect() {
    getDocs(collection(db, "Users"))
      .then((snapshot) => {
        let found = false
        const val = Id.replaceAll(" ", "")

        snapshot.forEach(doc => {
          if (doc.id === val) {
            localStorage.setItem("username", doc.id)
            window.location.href = "/Home"
            found = true
          }
        })

        if (!found) {
          setError("User not found")
        }
      })
  }

  return (
    <body>
    <div className={"logo-login"}>
      <p>
        Elliot photographie
      </p>
    </div>
    <div className={"background-images"}>
      {
        imageBackground.map((image, index) => {
          return (
            <img
              key={image ?? index}
              className={"image-background"}
              src={image}
              alt={''}/>
          )
        })
      }
    </div>
    <div className={"center"}>
      <div
        className={"container"}
        style={{
          zIndex: 1
        }}>
        <input
          type={"text"}
          placeholder={"Your ID"}
          id={"input"}
          value={Id}
          onChange={(e) => setId(e.target.value)}
          onClick={() => setError(undefined)}
        />
        <button onClick={connect}>
          Confirm
        </button>
        {
          error && <div className={"error"} id={"error"}>{error}</div>
        }
      </div>
    </div>
    <ContactBar style={{position: "absolute"}}/>
    </body>

  )
}