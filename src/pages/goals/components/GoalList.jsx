import './GoalList.css'

import Goal from "./Goal"

export default function GoalList({goals, setGoals}) {


    return <section id='goal-list'>
        <h3>Current Goals</h3>
        {
        goals.map((goal, index) => {
            return <Goal 
            key={index} 
            goal={goal}
            index={index}
            goals={goals}
            setGoals={setGoals}
            />
        })
        }
    </section>
}