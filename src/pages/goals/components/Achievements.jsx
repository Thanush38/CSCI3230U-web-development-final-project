import './Achievements.css'

import { useState } from "react"
import Badge from './Badge'
import BadgeList from './BadgeList'
import Streak from './Streak'


export default function Achievements(props) {
   

    return <section id='achievements' >
        <h3>Achievements</h3>
        <div className='content'>
            <Streak />
            <BadgeList />
        </div>
    </section>
}