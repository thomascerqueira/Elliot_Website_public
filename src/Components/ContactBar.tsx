import '../Styles/contactBar.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import React from "react";

interface Props {
  style?: React.CSSProperties
}

export function ContactBar(
  {
    style = {}
  }: Props
) {
  function openLink(link: string) {
    window.open(link)
  }

  return (
    <div className={"contact-bar"} style={style}>
      <div className={"info"}>
        <div className={"name"}>
          Elliot:
        </div>
        <span>
          Elliot.jeannes@hotmail.fr
        </span>
        <div className={"social"}>
          <FontAwesomeIcon className={"icon"}
                           icon={faInstagram}
                           onClick={() => openLink("https://www.instagram.com/elliot_photographie")}/>
        </div>
      </div>
      <div className={"info"}>
        <div className={"name"}>
          Site made by Thomas Cerqueira:
        </div>
        <span>
          thomas_cerqueira@yahoo.fr
        </span>
        <div className={"social"}>
          <FontAwesomeIcon className={"icon"}
                           icon={faGithub}
                           onClick={() => openLink("https://github.com/thomascerqueira")}/>
          <FontAwesomeIcon className={"icon"}
                           icon={faLinkedin}
                           onClick={() => openLink("https://www.linkedin.com/in/thomas-cerqueira/")}/>
        </div>
      </div>
    </div>
  )
}