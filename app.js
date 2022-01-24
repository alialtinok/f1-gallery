const express = require('express')
// const res = require('express/lib/response')
const app = express()

const myLogger = (req,res,next)=> {
  console.log('MiddleWare katmanı çalıştırıldı');
  next()
}


const myLogger2 = (req,res,next)=> {
  console.log('MiddleWare2 katmanı çalıştırıldı');
  next()
}
//MIDDLEWARES
app.use(express.static('public'))
app.use(myLogger)
app.use(myLogger2)

app.get('/',(req,res) => {
 
  const f1Pgoto = {
    id : 1,
    name : "Lewis Hamilton",
    description : "Lewis Hamilton from Mercedes"
  }
  res.send(f1Pgoto)
})

const port = 3000;
app.listen(port, ()=> {
  console.log(`Uygulama ${port} nolu portu dinlemektedir.`);
})