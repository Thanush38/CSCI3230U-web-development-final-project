import './Badge.css'

export default function Badge({name, tier}) {


    return <article className="badge">
        <img src={`/badges/tier${tier}.png`} />
        <p>{name}</p>
    </article>
}