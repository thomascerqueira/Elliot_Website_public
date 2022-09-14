import '../Styles/navbar.css'

export default function NavBar() {
    function onBurgerClick() {
    const navItem = document.querySelector('.nav-item')
    const burger = document.querySelector('.burger')
    const navLinks = document.querySelectorAll('.nav-item li')

    navItem?.classList.toggle('nav-active')
    navLinks.forEach((link, index) => {
      // @ts-ignore
      if (!link.style.animation) {
        // @ts-ignore
        link.style.animation = `navLinkFade 500ms ease forwards ${index / 7}s`
      } else {
        // @ts-ignore
        link.style.animation = ''
      }
    })
    burger?.classList.toggle('toggle')
  }

  return (
    <nav>
      <div className="logo">
        <h4>Elliot Photographie</h4>
      </div>
      <ul className="nav-item" id="nav-item">
        <li>
          <a href={'/home'}>
            <span className={"material-icons-sharp"}>home</span>
            <h3>Home</h3>
          </a>
        </li>
        {
          localStorage.getItem('username') === process.env.REACT_APP_ADMIN &&
          <li>
            <a href={'/settings'}>
              <span className={"material-icons-sharp"}>settings</span>
              <h3>Settings</h3>
            </a>
          </li>
        }
        {
          <li>
            <a href={'/photos'}>
              <span className={"material-icons-sharp"}>photo_camera</span>
              <h3>Photos</h3>
            </a>
          </li>
        }
        <li>
          <a href={'/'} onClick={() => {
            localStorage.removeItem("username")
          }}>
            <span className={"material-icons-sharp"}>logout</span>
            <h3>Se déconnecter</h3>
          </a>
        </li>
      </ul>
      <div className="burger" onClick={onBurgerClick}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  )
}