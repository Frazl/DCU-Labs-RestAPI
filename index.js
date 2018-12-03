fs = require('fs')
express = require('express')

const spawn = require("child_process").exec;

let g_labs = ['LG25', 'LG26', 'LG27', 'L101', 'L114', 'L125', 'L128',]
let g_data = {}

let update = (res) => {
    proc = spawn('python3 ./get.py')
    
    proc.stdout.on('data', (data) => {
        g_data = JSON.parse(data)
        g_data.lastUpdate = new Date()
        }
    )

    proc.on('exit', () => {
        console.log('Finished Updating')
        res()
        }
    )
}

function getTime(){
    let hour = new Date().getHours()
    let minute = new Date().getMinutes()

    if(minute > 30){
        minute = '00'
        hour += 1
    }
    else{
        minute = '30'
    }
    if(String(hour).length == 1){
        hour = '0'+String(hour)
    }
    hour = String(hour)
    return hour+':'+minute
}

function consecutive(exclude=undefined) {
    let labs = g_labs
    let data = g_data
    let result = {}

    if(exclude !== undefined){
        for(let i = 0; i < exclude.length; i++){
            let j = labs.indexOf(exclude[i])
            labs.splice(j, 1)
        }
    }
    const times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00', '17:30']
    
    let nowIndex = times.indexOf(getTime())
    if (nowIndex === -1){
        nowIndex = 0
    }
    let avail = []
    for(let i = nowIndex; i < times.length; i++){
        for(labIndex in labs){
            if(data[labs[labIndex]][times[i]] == 'FREE'){
                avail.push(labs[labIndex])
            }
        }
        if(avail.length == 0){
            result.labs = labs
            result.freeUntill = times[i]
            return result
        }
        labs = avail
        avail = []
        nowIndex = i


    }
    result.labs = labs
    result.freeUntill = times[nowIndex]
    return result

}

var app = express()

app.get('/api/v1/max', (req, res) => {
    let result = consecutive([req.query.exclude])
    res.status(200).send(result)
})

app.get('/api/v1/labs', (req, res) => {
    res.status(200).send(g_data)
})

app.get('/api/v1/lab', (req, res) => {
    res.status(200).send(g_data[req.query.lab])
})


const PORT = 8181;

app.listen(process.env.PORT || PORT, () => {
    console.log(`server running on port ${PORT}`)
  });

function run() {
    new Promise(update).then(() => { 
        console.log('Got latest lab times.')
        console.log(new Date())
    })
    setInterval(run, 1000 * 60 * 10);
}

run()