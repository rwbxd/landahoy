import { useEffect, useState } from "react"

function Series() {
  const [series, setSeries] = useState<SeriesAPIResponse[]>([]);

  useEffect(() => {
    fetch("http://localhost:5050").then(res => res.json()).then(data => {console.log(data); setSeries(data);})
  }, [])

  return (
    <>
      <p>Content here</p>
      <div>{series.map((s) => {
        return (
          <div key={s.id}>
            <p>Series: {s.tvdb_id}</p>
            <p>Complete: {s.complete.toString()}</p>
          </div>
        )
      })}</div>
    </>
  )
}

interface SeriesAPIResponse {
  id: string;
  tvdb_id: number;
  complete: boolean;
}

export default Series