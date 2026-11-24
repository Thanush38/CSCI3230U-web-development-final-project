

export default function Log({log}) {


    return <article className='log'>
        <h4>Date: {log.date} - New Progress: {log.current}</h4>
        <p>{log.message}</p>
    </article>
}