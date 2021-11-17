import React, {Component} from 'react'

class Airdrop extends Component {
    //Airdrop to have a timer that counts down
    //initialize only after our customer has staked a certain amount... 50
    //timer functionality, countdown, startTimer, state - for time to work..

    constructor() {
        super() 

        this.state = {time: {}, seconds: 20}
        this.timer = 0
        this.startTimer = this.startTimer.bind(this)
        this.countDown = this.countDown.bind(this)
    }

    startTimer() {
        if(this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000) //1000 pomeni 1sec naenkrat
        }
    }

    countDown() {
        // countdown 1 seconds at a time
        let seconds = this.state.seconds - 1
        
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })

        // stop counting when we hit zero
        if(seconds == 0) {
            clearInterval(this.timer)   //vgrajena funkcija
        } 
    }

    secondsToTime(secs) {
        let hours, seconds, minutes

        hours = Math.floor(secs / (60 * 60))

        let devisor_for_minutes = secs % (60 * 60) //dobimo ostanek sekund
        minutes = Math.floor(devisor_for_minutes / 60)

        let devisor_for_seconds = devisor_for_minutes % 60
        seconds = Math.ceil(devisor_for_seconds)

        let obj = {
            'h':hours,
            'm':minutes,
            's':seconds
        }
        return obj
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds)
        this.setState({time: timeLeftVar})
    }

    airdropReleaseTokens() {
        let stakingB = this.props.stakingBalance

        if(stakingB >= '50000000000000000000') {
            this.startTimer()
        }
    }

    render() {
        this.airdropReleaseTokens()
        return (
            <div style={{color:'black'}}>
                {this.state.time.m}: {this.state.time.s}
                
            </div>
        )
    }
}
export default Airdrop;