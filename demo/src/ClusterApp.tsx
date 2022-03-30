import React from 'react';
import './App.css';
import { Divider, Slider, Button, MenuItem, Select,Input,FormControl,TextField,Stack} from '@mui/material';
import { rubricItem, rubricItems, clusterItem } from './data';
import { Viz } from './ClusterViz';

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

    // selectSlider(event: )
    
    render(): React.ReactNode {
        return <div className='view'>
            <div className='logo'>
                <p></p>
            </div>
            <div className='title'>
                <h1>{"Step 1:  Design Rubric Based on Clustering"}</h1>
            </div>
            <div className='content'>
                <div id="cluster">
                <p>Note: You can change the Distance to see different clustering results ⬇️</p>
                <p>Distance defines how diverse student submissions could be within a cluster. (0: each submission is a cluster; 6: only one cluster left)</p>
                    <div id="range-slider" style={{display: "inline-block", width: "70%"}}>
                    <span style={{display: "inline-block"}}>Set the Distance: </span>
                        <Slider
                            size="small"
                            defaultValue={2}
                            min={0}
                            max={6}
                            aria-label="Small steps"
                            valueLabelDisplay="on"
                            step={0.5}
                            marks
                        />
                    </div>
                    <h2>Cluster Result</h2>
                    <div id="cluster-viz">
                        <Viz/>
                    </div>
                </div>
                <div id="cluster-analysis">
                    <div id="rubric-design">
                        <h2>Design Rubrics for Question 1</h2>
                        <p>Note: You can write down the rubric based on representative examples</p>
                        <Divider/>
                        <p>Total Points: 8 pts</p>
                        <form onSubmit={this.submitRubric}>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <label style={{display: "block",color: "#9c27b0"}} key={index}>
                                    {value.point} pts:&nbsp;
                                    <Input
                                        style={{width: "80%", height: "40px"}}
                                        type="text"
                                        defaultValue={value.defaultValue}
                                    ></Input>
                                </label>
                            })}
                            <p></p>
                            <Button variant="outlined" size="small" type="submit">Submit</Button>
                        </form>
                    </div>
                    <div id="overview">
                        <div>
                        <h2>Representative Example from cluster {this.state.selectedClusterID}</h2>
                            {
                            Object.values(this.state.clusterItems).map((value: clusterItem, index: number) => {
                                return  <Button variant="outlined" size="small" key={index} onClick={this.selectCluster} 
                                    data-id={value.id} 
                                >cluster {value.id}</Button>
                            })}
                        </div>
                        <div>
                            <Input
                                style={{width: "80%", height: "40px",background: "#C15BB117"}}
                                value={this.state.selectedClusterID===undefined? "submission 1": this.state.clusterItems[this.state.selectedClusterID].items[2]}
                                readOnly
                            />
                            <Input
                                style={{width: "80%", height: "40px",background: "#C15BB117"}}
                                value={this.state.selectedClusterID===undefined? "submission 2": this.state.clusterItems[this.state.selectedClusterID].items[3]}
                                readOnly
                            />
                        </div>
                        <form>
                        <p></p>
                        <Stack direction="row" spacing={2}>
                            <Button color="secondary">Regrade</Button>
                                <FormControl style={{width: 100}}> 
                                    <Select size="small">
                                    <MenuItem disabled value="">
                                        <em>Score</em>
                                    </MenuItem>
                                        {rubricItems.map((value: rubricItem, index: number) => {
                                            return <MenuItem  value={value.point} key={index}>{value.point} pts</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" size="small">Submit</Button>
                        </Stack>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    }
}

export  {ClusterApp};
