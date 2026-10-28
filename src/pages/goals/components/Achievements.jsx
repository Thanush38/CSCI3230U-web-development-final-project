import './Achievements.css'

import { useState } from "react"
import Badge from './Badge'


export default function Achievements(props) {
    const [streak, setStreak] = useState(3)
    const [currentWeek, setCurrentWeek] = useState(0) // use date to find actual week
    const [weekHours, setWeekHours] = useState(4)
    const [goalWeekHours, setGoalWeekHours] = useState(10)

    return <section id='achievements' >
        <h3>Achievements</h3>
        <div className='content'>
            <div id="streak">
                <h4>Streak</h4>
                <div id="streak-image">
                    <img src="\streak.png" />
                    <div>
                        {streak}
                    </div>
                </div>
                <div id='streak-week'>
                    <p id='streak-progress' >Weekly Goal: {weekHours} / {goalWeekHours} Hours ({Math.round((weekHours/goalWeekHours)*100)}%)</p>
                    <progress max={goalWeekHours} value={weekHours} />
                    <p>{goalWeekHours-weekHours} more workout hours left until you hit your goal!</p>
                </div>
            </div>
            <div id="badges">
                <h4>Badges</h4>
                <div id="badge-display">
                    <Badge />
                    <Badge />
                    <Badge />
                </div>
            </div>
        </div>
    </section>
}