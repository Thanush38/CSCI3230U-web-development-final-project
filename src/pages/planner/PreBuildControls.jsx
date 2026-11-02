import React from 'react';
import './PreBuildControls.css'
function PreBuildControls() {
    return (
        <section className="workout-input pre-build">
            <div className="control-group">
                <label htmlFor="pre-buildInput">Pre-built Workout</label>
                <select id="pre-buildInput" name="PreBuild Activity"></select>
                <button type="button" id="preBuildAddBtn">Add</button>
            </div>
            
            <div className="control-group">
                <label htmlFor="reccInput">Recommended Build</label>
                <select id="reccInput" name="Recommended Activity">
                    <option value="" defaultValue disabled>Select a recommended build</option>
                    <option value="Calisthenics">Calisthenics</option>
                    <option value="Bigger Back">Bigger Back</option>
                    <option value="Bigger Chest">Bigger Chest</option>
                    <option value="First Pull-Up">First Pull-Up</option>
                </select>
                <button type="button" id="reccAddBtn">Add</button>
            </div>

            <div id="links">
                <h2>Table of Contents</h2>
                <a href="#chest-input">Chest</a>
                <a href="#back-input">Back</a>
                <a href="#leg-input">Leg</a>
                <a href="#shoulder-input">Shoulder</a>
                <a href="#arm-input">Arm</a>
                <a href="#core-input">Core</a>
                <a href="#workout-regime">Workout Regime</a>
            </div>
        </section>
    );
}

export default PreBuildControls;