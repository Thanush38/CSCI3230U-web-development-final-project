

export function buildGoal(name, info, min, max, current) {
    const goal = {
        id: crypto.randomUUID(),
        name: String(name),
        info: String(info),
        min: Number(min),
        max: Number(max),
        current: Number(current),
        logs: []
    }    

    // replace with defaults if info omitted
    if (current === '') {
        goal.current = goal.min   
    }

    goal.logs.push(buildLog(goal.current, 'Goal Started'))

    // check data compliance
    if (goal.min > goal.max || 
        goal.min > goal.current || 
        goal.max < goal.current
    ) {
        return
    }    

    return goal
}

export function buildLog(goal, current, message) {
    const id = crypto.randomUUID()
    const date = new Date().toDateString()

    const log = {
        id: id,
        current: Number(current),
        message: message,
        date: date
    }

    // sanitise
    if (current === '' || log.current > goal.max || log.current < goal.min) {
        return
    }

    return log
}