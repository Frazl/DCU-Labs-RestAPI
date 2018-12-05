fs = require('fs')
express = require('express')

const spawn = require("child_process").exec;

const g_labs = ['LG25', 'LG26', 'LG27', 'L101', 'L114', 'L125', 'L128',]

const c_rooms = ['CG01', 'CG02', 'CG03', 'CG04', 'CG05', 'CG06', 'CG11',
                 'CG12', 'CG20', 'CG68', 'CG86', 'C166']
let g_data = {}

let update = (res) => {
    proc = spawn('python get.py')
    var proc_data = ''
    proc.stdout.on('data', (data) => {
        proc_data += data
        }
    )

    proc.on('exit', () => {
        g_data = JSON.parse(proc_data)
        g_data.lastUpdate = new Date()
        console.log('Finished Updating')
        res()
        }
    )
}

function getTime(){
    let hour = new Date().getUTCHours()
    let minute = new Date().getUTCMinutes()

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
    let labs = [...g_labs]
    let data = g_data

    if(exclude !== undefined){
        for(let i = 0; i < exclude.length; i++){
            let j = labs.indexOf(exclude[i])
            labs.splice(j, 1)
        }
    }
    const times = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
    
    let time = getTime()
    let nowIndex = times.indexOf(time)
    if (nowIndex === -1){
        nowIndex = 0
    }
    let avail = []
    for(var i = nowIndex; i < times.length; i++){
        for(labIndex in labs){
            if(data[labs[labIndex]][times[i]] == 'FREE'){
                avail.push(labs[labIndex])
            }
        }
        if(avail.length == 0){
            break
        }
        labs = avail
        avail = []


    }
    let result = {}
    result.labs = labs
    result.freeUntill = times[i]
    result.lastUpdate = g_data.lastUpdate
    return result

}

var app = express()

app.get('/api/v1/labs/max', (req, res) => {
    res.status(200).send(consecutive([req.query.exclude]))
})

app.get('/api/v1/rooms', (req, res) => {
    res.status(200).send(g_data)
})

app.get('/api/v1/room', (req, res) => {
    let result = g_data[req.query.room]
    result.lastUpdate = g_data.lastUpdate
    res.status(200).send(result)
    result = {}
})


const PORT = 8181;

app.listen(process.env.PORT || PORT, () => {
    console.log(`server running on port ${PORT}`)
  });

function run() {
    new Promise(update).then(() => { 
        console.log('Got latest lab times.')
        console.log(new Date())
        setInterval(run, 1000 * 60 * 10);
    })
}

run()
