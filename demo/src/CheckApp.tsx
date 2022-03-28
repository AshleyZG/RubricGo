import React from 'react';
import logo from './logo.svg';
import './App.css';
import { rubricItem, rubricItems, clusterItem} from './data';
import { Viz } from './ClusterViz';
import { Divider} from '@mui/material';

interface SimilarAppProps{};
interface SimilarAppState{
    similarItems: {[id: number]: clusterItem};
    clusterItems: {[id: number]: clusterItem};
    selectedClusterID: number | undefined;
};

class CheckApp extends React.Component<SimilarAppProps, SimilarAppState> {
    constructor(props: any){
        super(props);
        this.state = {
            clusterItems: {},
            similarItems: {},
            selectedClusterID: undefined
        }
        
        this.selectCluster = this.selectCluster.bind(this);
    };

    componentDidMount(){
        console.log('todo: read distant results');
        fetch("http://localhost:5000/distantResult")
        .then((response) => {
			if (!response.ok){
				throw new Error('Something went wrong');
			}
			return response.json();
        })
        .then((data) => {
            var clusterItems: {[id:number]: clusterItem} = {};
            var similarItems: {[id:number]: clusterItem} = {};
            data.similarContent.forEach((value: any) => {
                clusterItems[value.cluster] = {id: value.cluster, items: []};
                similarItems[value.cluster] = {id: value.cluster, items: []};
                clusterItems[value.cluster].items.push(value.answer[0]);
                for (let i = 1; i < 6; i++){
                    similarItems[value.cluster].items.push(value.answer[i]);
                }
            })
            this.setState({
                similarItems: similarItems,
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
            if ((form.elements[index] as HTMLInputElement).value !=""){
                value.defaultValue = (form.elements[index] as HTMLInputElement).value;
            } else {
                value.defaultValue = value.defaultValue
            }
        })
    }

    render(): React.ReactNode {
        return <div className='view'>
            <div className='title'>
            <h1>{"Step 2:  Check Potential Error, Regrade, and Re-design the Rubric"}</h1>
            </div>
            <div id = "cluster"> 
                <h2>Cluster Result</h2>
                <div id="cluster-viz">
                        <Viz/>
                </div>
            </div>
            <div id="cluster-analysis">
                <div id="rubric-redesign">
                    <div id="rubric-display">
                        <h2>Edit Rubric</h2>
                        <p>Total Points: 10 pts</p>
                        <form onSubmit={this.submitRubric}>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <label style={{display: "block"}} key={index}>
                                    {value.point} pts:
                                    <input
                                        style={{width: "80%", height: "40px"}}
                                        type="text"
                                        placeholder={value.defaultValue}
                                    ></input>
                                </label>
                            })}
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
                <div id="error">
                    <h2>Potential Error Submission</h2>
                    <div>
                        {Object.values(this.state.clusterItems).map((value: clusterItem, index: number) => {
                            return  <button key={index} onClick={this.selectCluster}
                                data-id={value.id}
                            >cluster {value.id}</button>
                        })}
                    </div>
                    <Divider/>
                    <div>
                        <p>Potential Error Example from cluster {this.state.selectedClusterID}</p>
                        <input
                            style={{width: "90%", height: "60px"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the potential error submission": this.state.clusterItems[this.state.selectedClusterID].items[0]}
                        />
                    </div>
                    <form>
                        <label>
                            Select a rubric level to re-grade
                            <select>
                                {rubricItems.map((value: rubricItem, index: number) => {
                                    return <option value={value.point} key={index}>{value.point} pts</option>
                                })}
                            </select>
                        </label>
                    </form>
                    <div id="SimilarSubmission">
                    <h2>Similar submissions that could potentially be affected</h2>
                        <input
                            style={{width: "90%", height: "60px"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[0]}
                        />
                        <input
                            style={{width: "90%", height: "60px"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[1]}
                        />
                        <input
                            style={{width: "90%", height: "60px"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[2]}
                        />
                        <input
                            style={{width: "90%", height: "60px"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[3]}
                        />
                        <input
                            style={{width: "90%", height: "60px"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[4]}
                        />
                        <select>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <option value={value.point} key={index}>{value.point} pts</option>
                            })}
                        </select>
                </div>
                </div>
            </div>
        </div>
    }
}

export  {CheckApp};
