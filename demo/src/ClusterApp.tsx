import React from 'react';
import './App.css';
import { Divider, Slider } from '@mui/material';
import { rubricItem, rubricItems, clusterItem, clusterItems } from './data';

interface Answer{
    id: number;
    text: string;
    agg_bert_row: number;
}
interface ClusterAppProps{};
interface ClusterAppState{
    clusteredAnswers: Answer[];
};

class ClusterApp extends React.Component<ClusterAppProps, ClusterAppState> {
    constructor(props: any){
        super(props);
        this.state = {
            clusteredAnswers: [],
        }
    }

    componentDidMount(){
        console.log('todo: read clustering results');
        fetch("http://localhost:5000/clusterResult")
        .then((response) => {
			if (!response.ok){
				throw new Error('Something went wrong');
			}
			return response.json();
        })
        .then((data) => {
            this.setState({clusteredAnswers: data.clusteredAnswers})
        })
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
                        {this.state.clusteredAnswers.map((value: Answer) => {
                            return <div>
                                {value.text}
                            </div>
                        })}
                    </div>
                </div>
                <div id="cluster-analysis">
                    <div id="rubric-design">
                        <h2>Design Rubrics for Question 1</h2>
                        <Divider/>
                        <p>Total Points: 10 pts</p>
                        <form>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <label style={{display: "block"}} key={index}>
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
                                return  <button key={index}>cluster {value.id}</button>
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
                                    {rubricItems.map((value: rubricItem, index: number) => {
                                        return <option value={value.point} key={index}>{value.point} pts</option>
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
