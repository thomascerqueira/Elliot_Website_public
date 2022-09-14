import React, {useEffect, useRef, useState} from "react";
import '../Styles/styles.css'
import '../Styles/container.css'
import NavBar from "../Components/Navbar";
import {doc, getDoc} from "@firebase/firestore";
import {db, storage} from "../Utils/config";
import {getDownloadURL, ref} from "@firebase/storage";
import PhotoGrid, {Photo} from "../Components/PhotoGrid";
import {toast} from "react-toastify";
import JSZip from "jszip";
import {ContactBar} from "../Components/ContactBar";

export default function Photos() {
  const [files, setFiles] = useState<Photo[]>([]);
  const toastId = useRef(null);

  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile = width <= 1300;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);


  function listenerCallback(e: StorageEvent) {
    if (!localStorage.getItem('username')) {
      window.location.href = "/"
    }
  }

  const saveFile = async (blob: any) => {
    const a = document.createElement('a');
    a.download = 'allPhoto.zip';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  function downloadAll() {
    getDoc(doc(db, "Users", localStorage.getItem("username") as string))
      .then(async (snapshot) => {
        if (!snapshot.data()) {
          toast.error("Vous n'avez pas le droit d'être ici")
          window.location.href = "index.html"
        }

        if (!snapshot.data()?.files) {
          return
        }
        const files = snapshot.data()?.files.sort(function (x: string, y: string) {
          const first = x.substring(x.lastIndexOf('_'))
          const second = y.substring(y.lastIndexOf('_'))
          return second.localeCompare(first)
        })

        let zip = new JSZip();
        let count = 0;
        let urls = []
        let names: any[] = []

        // @ts-ignore
        toastId.current = toast.loading("Téléchargement des images")
        for (const file of files) {
          try {
            const res = await getDownloadURL(ref(storage, file))
            urls.push(res)
            names.push(file)
          } catch {
          }
        }

        urls.forEach(function (url, index) {
          let filename = `${names[index]}`;
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onerror = (error) => {
            toast.error(error.type)
          }
          xhr.onload = (event) => {
            const blob = xhr.response;
            zip.file(filename, blob);
            count++;
            if (count === urls.length) {
              zip.generateAsync({type: 'blob'}).then(function (content) {
                saveFile(content)
              });
              // @ts-ignore
              toast.update(toastId.current, {render: "Finis !", type: "success", isLoading: false, autoClose: 5000})
            }
          };
          xhr.open('GET', url);
          xhr.send();
        });
      })
  }

  useEffect(() => {
    setFiles([])
    // @ts-ignore
    getDoc(doc(db, 'Users', localStorage.getItem("username")))
      .then(async (snapshot) => {
        const data = snapshot.data()
        if (!data) {
          alert("You are not allowed")
          window.location.href = "index.html"
        }
        if (!data?.files) {
          return
        }

        const files = data.files.sort(function (x: string, y: string) {
          const first = x.substring(x.lastIndexOf('_'))
          const second = y.substring(y.lastIndexOf('_'))
          return second.localeCompare(first)
        })

        files.forEach((file: string) => {
          getDownloadURL(ref(storage, file))
            .then(res => {
              setFiles(prevState => ([
                ...prevState,
                {
                  photo: res,
                  desc: file
                }
              ]))
            })
        })

      })
  }, []);


  useEffect(() => {
    if (!localStorage.getItem('username')) {
      window.location.href = "/"
    }
    window.addEventListener("storage", listenerCallback)

    return () => {
      window.removeEventListener("storage", listenerCallback)
    }
  }, []);

  return (
    <div className={"body"}>
      <NavBar/>
      {
        !isMobile && <div className={"container"}>
          <button onClick={() => {
            downloadAll()
          }}>
            Télécharger vos photos
          </button>
        </div>
      }

      <PhotoGrid photos={files}/>
      <ContactBar/>
    </div>

  )
}