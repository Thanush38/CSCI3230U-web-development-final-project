import './GoalList.css'

import Goal from "./Goal"

export default function GoalList({goals, updateGoal, deleteGoal}) {


    return <section id='goal-list'>
        <h3>Current Goals</h3>
        {
        goals.map((goal) => {
            return <Goal 
            key={goal.id} 
            goal={goal}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            />
        })
        }
    </section>
}