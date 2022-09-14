import "../Styles/progressBar.css"

interface Props {
  pct: number
}

export function ProgressionBar(
  {
    pct
  } : Props
) {
  const fillStyle = {
    width: `${pct}%`,
  }

  return(
    <div className={"container-progress"}>
      <div className={"fill"} style={fillStyle}>
        <span className={"text"}>{`${pct.toFixed(2)}%`}</span>
      </div>
    </div>
  )
}