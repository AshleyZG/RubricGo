import React from 'react';
import './App.css';
import { Divider, Slider } from '@mui/material';
import { rubricItem, rubricItems, clusterItem, clusterItems } from './data';


class ClusterApp extends React.Component {
    constructor(props: any){
        super(props);
    }

    render(): React.ReactNode {
        return <div className='view'>
            <div className='title'>
                <h1>{"Step 1:  Design Rubric Based on Clustering"}</h1>
            </div>
            <div className='content'>
                <div id="cluster">
                    <p style={{display: "inline-block"}}>Similarity: </p>
                    <div id="range-slider" style={{display: "inline-block", width: "70%"}}>
                        <Slider
                            size="small"
                            defaultValue={70}
                            min={0}
                            max={100}
                            aria-label="Small"
                            valueLabelDisplay="auto"
                        />
                    </div>
                    <div id="cluster-viz">
                        Todo: add cluster visualization
                    </div>
                </div>
                <div id="cluster-analysis">
                    <div id="rubric-design">
                        <h2>Design Rubrics for Question 1</h2>
                        <Divider/>
                        <p>Total Points: 10 pts</p>
                        <form>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <label style={{display: "block"}}>
                                    {value.point} pts:
                                    <input
                                        type="text"
                                    ></input>
                                </label>
                            })}
                        </form>
                        <button>Submit</button>
                    </div>
                    <div id="overview">
                        <div>
                            {clusterItems.map((value: clusterItem, index: number) => {
                                return  <button>cluster {value.id}</button>
                            })}
                        </div>
                        <Divider/>
                        <div>
                            <p>Representative Example</p>
                            <input
                                style={{width: "80%", height: "60px"}}
                                value={"submission 1"}
                                readOnly
                            />
                            <input
                                style={{width: "80%", height: "60px"}}
                                value={"submission 2"}
                                readOnly
                            />
                        </div>
                        <form>
                            <label>
                                Grade cluster  ??
                                <select>
                                    {rubricItems.map((value: rubricItem) => {
                                        return <option value={value.point}>{value.point} pts</option>
                                    })}
                                </select>
                            </label>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    }
}

export  {ClusterApp};
