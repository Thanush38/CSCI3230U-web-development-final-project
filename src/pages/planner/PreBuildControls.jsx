import React, { useState } from 'react';
import './PreBuildControls.css';

function PreBuildControls({
    savedBuildNames = [],
    recommendedBuildNames = ['Calisthenics', 'Bigger Back', 'Bigger Chest', 'First Pull-up'],
    onLoadBuild,
}) {
    const [selectedPreBuilt, setSelectedPreBuilt] = useState('');
    const [selectedRecommended, setSelectedRecommended] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddPreBuilt = () => {
        if (!selectedPreBuilt) {
            setErrorMessage('Please select a pre-built workout first.');
            return;
        }
        setErrorMessage('');
        onLoadBuild?.(selectedPreBuilt, true);
    };

    const handleAddRecommended = () => {
        if (!selectedRecommended) {
            setErrorMessage('Please select a recommended build first.');
            return;
        }
        setErrorMessage('');
        onLoadBuild?.(selectedRecommended, false);
    };

    return (
        <section className="workout-input pre-build" aria-label="Workout build presets">
            <div className="control-group">
                <label htmlFor="pre-buildInput">Pre-built Workout</label>
                <select
                    id="pre-buildInput"
                    name="PreBuild Activity"
                    value={selectedPreBuilt}
                    onChange={(e) => setSelectedPreBuilt(e.target.value)}
                >
                    <option value="" disabled>
                        Select a pre-built workout
                    </option>
                    {savedBuildNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <button type="button" id="preBuildAddBtn" onClick={handleAddPreBuilt}>
                    Add
                </button>
            </div>

            <div className="control-group">
                <label htmlFor="reccInput">Recommended Build</label>
                <select
                    id="reccInput"
                    name="Recommended Activity"
                    value={selectedRecommended}
                    onChange={(e) => setSelectedRecommended(e.target.value)}
                >
                    <option value="" disabled>
                        Select a recommended build
                    </option>
                    {recommendedBuildNames.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <button type="button" id="reccAddBtn" onClick={handleAddRecommended}>
                    Add
                </button>
            </div>

            {errorMessage && (
                <p role="alert" className="form-error">
                    {errorMessage}
                </p>
            )}

            <div id="links">
                <h2>Table of contents</h2>
                <a href="#chest-input">Chest</a>
                <a href="#back-input">Back</a>
                <a href="#leg-input">Leg</a>
                <a href="#shoulder-input">Shoulder</a>
                <a href="#arm-input">Arm</a>
                <a href="#core-input">Core</a>
                <a href="#workout-regime-section">Workout Regime</a>
            </div>
        </section>
    );
}

export default PreBuildControls;