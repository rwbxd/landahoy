import { useEffect, useState } from "react"

function Series() {
  const [series, setSeries] = useState<SeriesAPIResponse[]>([]);

  useEffect(() => {
    fetch("http://localhost:5050/api").then(res => res.json()).then(data => {console.log(data); setSeries(data);})
  }, [])

  return (
    <>
      <p>Content here</p>
      <div>{series.map((s) => {
        return (
          <div key={s.ID}>
            <p>Series: {s.TVDB_ID}</p>
            <p>Complete: {s.COMPLETE === 0 ? 'false' : 'true'}</p>
          </div>
        )
      })}</div>
    </>
  )
}

interface SeriesAPIResponse {
  ID: string;
  TVDB_ID: number;
  COMPLETE: number;
}

export default Series