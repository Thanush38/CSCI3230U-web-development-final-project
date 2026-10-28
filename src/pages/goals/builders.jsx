

export function buildGoal(formData) {
    const id = crypto.randomUUID()
    const name = formData.get('name')
    const info = formData.get('info')
    const min = formData.get('min')
    const max = formData.get('max')
    const current = formData.get('current')

    const newGoal = {
        id: id,
        name: String(name),
        info: String(info),
        min: Number(min),
        max: Number(max),
        current: Number(current),
        logs: []
    }

    // replace with defaults if info omitted
    if (current === '') {
        newGoal.current = newGoal.min   
    }

    newGoal.logs.push(buildLogManual(newGoal.current, 'Goal Started'))

    // check data compliance
    if (min > max || min > current || max < current) {
        return
    }    

    return newGoal
}

export function buildLog(goal, formData) {
    const id = crypto.randomUUID()
    const current = formData.get('current')
    const message = formData.get('message')
    const date = new Date().toDateString()

    // sanitise
    if (current === '' || current > goal.max || current < goal.min) {
        return
    }

    const log = {
        id: id,
        current: current,
        message: message,
        date: date
    }

    return log
}

export function buildLogManual(current, message) {
    const id = crypto.randomUUID()
    const date = new Date().toDateString()

    const log = {
        id: id,
        current: current,
        message: message,
        date: date
    }

    return log
}