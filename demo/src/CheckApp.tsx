import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Card } from '@mui/material';
import { rubricItem, rubricItems, clusterItem, errorSubmission,errorSubmissions, sameSubmissions,sameSubmission} from './data';


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
                    <form>
                        {rubricItems.map((value: rubricItem, index: number) => {
                            return <label style={{display: "block"}} key={index}>
                                {value.point} pts: 
                            <input type="text" placeholder={value.defaultValue}
                                ></input>
                            </label>
                        })}
                    </form>
                    <button>Submit</button>
                </div>
                <div id="ErrorSubmission">
                    <h2>Potential Error Submission</h2>
                    {errorSubmissions.map((value: errorSubmission, index: number) => {
                                return <input 
                                    type="text" 
                                    value={value.submission} 
                                    readOnly 
                                />
                            })}
                    <div id="ErrorAnswer"></div>
                    <p>Select a rubric level to re-grade</p>
                    <select>
                        {rubricItems.map((value: rubricItem, index: number) => {
                            return <option value={value.point}>{value.point}</option>
                        })}
                    </select>
                    <button>Submit</button>
                </div>
                <div id="SimilarSubmission">
                    <h2>Similar submissions that could potentially be affected</h2>
                    {sameSubmissions.map((value: sameSubmission, index: number) => {
                                return <input 
                                    type="text" 
                                    value={value.submission} 
                                    readOnly 
                                />
                            })}
                    <button>Update the score</button>
                </div>
            </div>
        </div>
    }
}

export  {CheckApp};
