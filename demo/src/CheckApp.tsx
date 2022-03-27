import React from 'react';
import logo from './logo.svg';
import './App.css';


class CheckApp extends React.Component {
    constructor(props: any){
        super(props);
    }

    render(): React.ReactNode {
        return <div className='view'>
            <div id="main-view" className='view'>
                <h1>{"Step 2:  Check Potential Error, Regrade, and Re-design the Rubric"}</h1>
                <div id="cluster">
                    <h2>Cluster</h2>
                    Todo: display clustering results
                </div>
                <div id="ShowRubric">
                    <h2>Initial Rubric</h2>
                    Todo: Show initial rubric
                    <button>Edit Rubric</button>
                </div>
                <div id="ErrorSubmission">
                    <h2>Potential Error Submission</h2>
                    <div id="ErrorAnswer"></div>
                    <p>Select a rubric level to re-grade</p>
                    <select id="select_grade">
                        <option value ="2pto">2pt</option>
                        <option value ="4pt">4pt</option> /** the option is from the initial rubric */
                    </select>
                    <button>Submit</button>
                </div>
                <div id="SimilarSubmission">
                    <h2>Similar submissions that could potentially be affected</h2>
                    Todo: Change Similar Submission Grade (compute the similarity)
                    <button>Update the score</button>
                </div>
            </div>
        </div>
    }
}

export  {CheckApp};
