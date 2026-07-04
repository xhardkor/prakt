const ws = new WebSocket('ws://localhost:8080')
ws.onmessage = (event) => {
  const root = document.getElementById('display-root')
  root.textContent = ''
  const data = JSON.parse(event.data)

  data.forEach( item => {
    Object.entries(item).forEach( ([k,v]) => {
      const p = document.createElement('p')
      p.id = k
      p.textContent = v
      console.log(k,'|',v)
      root.appendChild(p)
    })
  })

}
