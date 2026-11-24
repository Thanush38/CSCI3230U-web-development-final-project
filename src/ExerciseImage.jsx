import { useState } from 'react';

const PLACEHOLDER = '/workout-placeholder.svg';

// ExerciseDB's media server is missing GIFs for some exercises (their gifUrl
// 404s), so fall back to a local placeholder instead of a broken image icon.
export default function ExerciseImage({ src, alt, className }) {
    const [broken, setBroken] = useState(false);

    return (
        <img
            className={className}
            src={!src || broken ? PLACEHOLDER : src}
            alt={alt}
            loading="lazy"
            onError={() => setBroken(true)}
        />
    );
}
