import { useState } from 'react';

const PLACEHOLDER = '/workout-placeholder.svg';

// ExerciseDB's media server is missing GIFs for some exercises (their gifUrl
// 404s), so fall back to a local placeholder instead of a broken image icon.
// We remember *which* src failed, so a component that switches to a new
// exercise (e.g. the timer moving to the next set) tries the new image again.
export default function ExerciseImage({ src, alt, className }) {
    const [brokenSrc, setBrokenSrc] = useState(null);
    const showPlaceholder = !src || brokenSrc === src;

    return (
        <img
            className={className}
            src={showPlaceholder ? PLACEHOLDER : src}
            alt={alt}
            loading="lazy"
            onError={() => {
                if (!showPlaceholder) setBrokenSrc(src);
            }}
        />
    );
}
