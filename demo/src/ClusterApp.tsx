import React from 'react';
import './App.css';
import { Divider, Slider } from '@mui/material';
import { rubricItem, rubricItems, clusterItem } from './data';

interface Answer{
    id: number;
    text: string;
    agg_bert_row: number;
}
interface ClusterAppProps{};
interface ClusterAppState{
    clusteredAnswers: Answer[];
    clusterItems: {[id: number]: clusterItem};
    selectedClusterID: number | undefined;
};

class ClusterApp extends React.Component<ClusterAppProps, ClusterAppState> {
    constructor(props: any){
        super(props);
        this.state = {
            clusteredAnswers: [],
            clusterItems: {},
            selectedClusterID: undefined,
        }

        this.selectCluster = this.selectCluster.bind(this);
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
            var clusterItems: {[id:number]: clusterItem} = {};
            data.clusteredAnswers.forEach((value: any) => {
                if (! (value.agg_bert_row in clusterItems)){
                    clusterItems[value.agg_bert_row] = {id: value.agg_bert_row, items: []};
                }
                clusterItems[value.agg_bert_row].items.push(value.text);
            })
            this.setState({
                clusteredAnswers: data.clusteredAnswers,
                clusterItems: clusterItems,
            });
        })
    }

    selectCluster(event: React.MouseEvent){
        var button = event.target as HTMLElement;
        var clusterID = parseInt(event.currentTarget.getAttribute('data-id') as string);
        this.setState({selectedClusterID: clusterID});
    }

    submitRubric(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault();
        const form = event.currentTarget;
        rubricItems.forEach((value: rubricItem, index: number) => {
            value.defaultValue = (form.elements[index] as HTMLInputElement).value;
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
                        {this.state.clusteredAnswers.map((value: Answer, index: number) => {
                            return <div key={index}>
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
                        <form onSubmit={this.submitRubric}>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <label style={{display: "block"}} key={index}>
                                    {value.point} pts:
                                    <input
                                        style={{width: "80%", height: "40px"}}
                                        type="text"
                                    ></input>
                                </label>
                            })}
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                    <div id="overview">
                        <div>
                            {
                            Object.values(this.state.clusterItems).map((value: clusterItem, index: number) => {
                                return  <button key={index} onClick={this.selectCluster}
                                    data-id={value.id}
                                >cluster {value.id}</button>
                            })}
                        </div>
                        <Divider/>
                        <div>
                            <p>Representative Example from cluster {this.state.selectedClusterID}</p>
                            <input
                                style={{width: "80%", height: "60px"}}
                                value={this.state.selectedClusterID===undefined? "submission 1": this.state.clusterItems[this.state.selectedClusterID].items[0]}
                                readOnly
                            />
                            <input
                                style={{width: "80%", height: "60px"}}
                                value={this.state.selectedClusterID===undefined? "submission 2": this.state.clusterItems[this.state.selectedClusterID].items[1]}
                                readOnly
                            />
                        </div>
                        <form>
                            <label>
                                Grade cluster  {this.state.selectedClusterID}
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
