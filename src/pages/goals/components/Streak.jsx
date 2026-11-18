import { useState } from "react"
import useStreak from "../hooks/useStreak"


export default function Streak(props) {

    const [streak, weekHours, goalWeekHours] = useStreak()

    return <div id="streak">
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
}