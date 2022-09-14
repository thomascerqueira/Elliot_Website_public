import {useCallback, useEffect, useState} from "react";
import {addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, updateDoc} from "@firebase/firestore";
import {db, storage} from "../Utils/config";
import NavBar from "../Components/Navbar";
import '../Styles/styles.css'
import '../Styles/settings.css'
import {toast} from "react-toastify";
import {ref, uploadBytes} from "@firebase/storage";
import {ProgressionBar} from "../Components/ProgressionBar";

interface User {
  id: string,
  name: string,
  email: string
}

export default function Settings() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<number>(-1);

  const getAllUser = useCallback(
    () => {
      getDocs(collection(db, "Users"))
        .then((snapshot) => {
          const tmp: User[] = []
          snapshot.forEach(user => {
            const data = user.data()
            tmp.push({
              id: user.id,
              name: data.name,
              email: data.email
            })
          })
          setUsers(tmp)
        })
    },
    [],
  );

  function addUser() {
    if (email === "" || name === "") {
      toast.error("Rentre des valeurs :(")
      return
    }

    addDoc(collection(db, "Users"), {
      name: name,
      email: email,
      files: []
    })
      .then(() => {
        toast.success("Utilisateur ajouté !")
        getAllUser()
      })
  }

  async function sendFiles() {
    setLoading(0)
    let totalSent = 0
    if (!files) {
      return
    }
    const arrayFile = Array.from(files)

    arrayFile.forEach((file) => {
      const timestamp = Date.now();
      let splitted = file.name.split('.')
      const type = splitted.pop();
      const name = splitted.join('.');
      const fileName = `${name}_${timestamp}.${type}`;

      const storageRef = ref(storage, fileName);

      uploadBytes(storageRef, file)
        .then(async (snapshot) => {
          toast.success(`Uploaded ${fileName}`)
          await updateDoc(doc(db, "Information", "Files"), {
            files: arrayUnion(fileName)
          });
          await updateDoc(doc(db, "Users", process.env.REACT_APP_ADMIN as string), {
            files: arrayUnion(fileName)
          });
        })
        .catch(error => {
          toast.error(error)
        })
        .finally(() => {
          totalSent++
          setLoading(totalSent / arrayFile.length * 100)
          if (totalSent === arrayFile.length) {
            setLoading(-1)
            toast.info("Tout a été envoyé")
          }
        })
    })
  }

  function deleteUser(user: User) {
    deleteDoc(doc(db, 'Users', user.id))
      .then(() => {
        toast.success("Utilisateur supprimé")
        getAllUser()
      })
      .catch((er) => {
        toast.error(er)
      })
  }

  useEffect(() => {
    getAllUser()
    return () => {
    };
  }, [getAllUser]);


  return (
    <div className={"body"}>
      <NavBar/>
      <main>
        <section>
          <div className="add" id="add">
            <label htmlFor="file-form-submit" id="label-file" className="label-file">
              Choisir des images
            </label>
            <input className="file-form-submit" id="file-form-submit" type="file" name="file" multiple
                   onChange={(e) => {
                     setFiles(e.target.files)
                   }}/>
            <input className={"button-form-submit"} id="button-form-submit" type="submit" value="Upload"
                   onClick={async () => {
                     await sendFiles()
                   }}/>
          </div>
          {
            loading !== -1 && <ProgressionBar pct={loading}/>
          }
        </section>

        <section>
          <div className="div-new-user">
            <input className="email" type="email" id="email" placeholder="Email"
                   onChange={(e) => setEmail(e.target.value)}/>
            <input id="name" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
            <button id="send" onClick={() => {
              addUser()
            }}>Confirm
            </button>
          </div>
        </section>
        <div className="user title">
          <div></div>
          <h3>ID</h3>
          <h3>Email</h3>
          <h3>Name</h3>
        </div>
        <div>
          {
            users.map((user: User) => {
              return (
                <div className={"user"} key={user.id}>
                <span
                  className={"material-icons-sharp"}
                  style={{
                    color: 'red',
                    cursor: "pointer"
                }}
                  onClick={() => deleteUser(user)}
                >
                  close
                </span>
                  <span>{user.id}</span>
                  <span>{user.email}</span>
                  <span>{user.name}</span>
                </div>
              )
            })
          }
        </div>
      </main>
    </div>


  )
}