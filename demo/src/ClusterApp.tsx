import React from 'react';
import './App.css';
import { Divider, Slider, Button, MenuItem, Select,Input,FormControl,TextField,Stack} from '@mui/material';
import { rubricItem, rubricItems, clusterItem } from './data';
import { Viz } from './ClusterViz';
import { PlainObject } from 'react-vega';

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
    clusteredData: PlainObject;
};

class ClusterApp extends React.Component<ClusterAppProps, ClusterAppState> {
    constructor(props: any){
        super(props);
        this.state = {
            clusteredAnswers: [],
            clusterItems: {},
            selectedClusterID: undefined,
            clusteredData: {table: []},
        }

        this.selectCluster = this.selectCluster.bind(this);
        this.updateCluster = this.updateCluster.bind(this);
    }

    componentDidMount(){
        console.log('todo: read clustering results');
        // fetch("http://localhost:5000/clusterResult")
        // .then((response) => {
		// 	if (!response.ok){
		// 		throw new Error('Something went wrong');
		// 	}
		// 	return response.json();
        // })
        // .then((data) => {
        //     var clusterItems: {[id:number]: clusterItem} = {};
        //     data.clusteredAnswers.forEach((value: any) => {
        //         if (! (value.agg_bert_row in clusterItems)){
        //             clusterItems[value.agg_bert_row] = {id: value.agg_bert_row, items: []};
        //         }
        //         clusterItems[value.agg_bert_row].items.push(value.text);
        //     })
        //     this.setState({
        //         clusteredAnswers: data.clusteredAnswers,
        //         clusterItems: clusterItems,
        //     });
        // })

        var param = {distance: "2"};
        var query = new URLSearchParams(param).toString();
        fetch("http://localhost:5001/updateCluster?"+query)
        .then((response) => {
			if (!response.ok){
				throw new Error('Something went wrong');
			}
			return response.json();
        })
        .then((data) => {
            var clusterItems: {[id:number]: clusterItem} = {};
            var dataItems: any[] = [];
            data.clusteredAnswers.forEach((value: any) => {
                dataItems.push({x: value.x_position, y: value.y_position, text: value.text, color: value.agg_bert_row});

                if (! (value.agg_bert_row in clusterItems)){
                    clusterItems[value.agg_bert_row] = {id: value.agg_bert_row, items: []};
                }
                clusterItems[value.agg_bert_row].items.push(value.text);

            })
            this.setState({
                clusteredData: {table: dataItems},
                clusteredAnswers: data.clusteredAnswers,
                clusterItems: clusterItems,
            });
        })


    }

    selectCluster(event: React.MouseEvent){
        var button = event.target as HTMLElement;
        var clusterID = parseInt(event.currentTarget.getAttribute('data-id') as string);
        if (this.state.selectedClusterID === clusterID){
            this.setState({selectedClusterID: undefined});
        }else{
            this.setState({selectedClusterID: clusterID});
        }
    }

    submitRubric(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault();
        const form = event.currentTarget;
        rubricItems.forEach((value: rubricItem, index: number) => {
            value.defaultValue = (form.elements[index] as HTMLInputElement).value;
        })
    }

    updateCluster(event: Event | React.SyntheticEvent<Element, Event>, value: number | number[]){
        console.log(value);
        var param = {distance: value.toString()};
        var query = new URLSearchParams(param).toString();
        fetch("http://localhost:5001/updateCluster?"+query)
        .then((response) => {
			if (!response.ok){
				throw new Error('Something went wrong');
			}
			return response.json();
        })
        .then((data) => {
            var clusterItems: {[id:number]: clusterItem} = {};
            var dataItems: any[] = [];
            data.clusteredAnswers.forEach((value: any) => {
                // dataItems.push({x: value.x_position, y: value.y_position, text: value.text, color: value.agg_bert_row});
                dataItems.push({x: value.x_position, y: value.y_position, text: value.text, color: value.agg_bert_row});

                if (! (value.agg_bert_row in clusterItems)){
                    clusterItems[value.agg_bert_row] = {id: value.agg_bert_row, items: []};
                }
                clusterItems[value.agg_bert_row].items.push(value.text);

            })
            this.setState({
                clusteredData: {table: dataItems},
                clusteredAnswers: data.clusteredAnswers,
                clusterItems: clusterItems,
            });
        })

        // connect with backend and update clustering results
    }

    
    render(): React.ReactNode {
        return <div className='view'>
        <div className='sidebar'>
            <div className='logo'>
                <p></p>
            </div>
            <div className='title'>
                <h1>Step 1: Get an overview of the questions and student submissions</h1>
                <p>
                <h2>Question: Please describe one rule for ideation in human-centered design.</h2>
                </p>
                <p>
                    todo: student number
                </p>
            </div>
            <div className='title'>
                <h1>Step 2:  Understand different student answer groups </h1>
                <p>todo: explain what is students answer group, and how this could help the instructor</p>

                <p>present soem important information of the cluster</p>

                <p>todo: in this step, connect representative example with the viz</p>
            </div>
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
                            onChangeCommitted={this.updateCluster}
                        />
                    </div>
                    <h2>Cluster Result</h2>
                    <div id="cluster-viz">
                        <Viz data={this.state.clusteredData}/>
                    </div>
                </div>
        </div>
        <div className='content'>



                <div id="cluster-analysis">
                <div id="rubric-design">
                        <h2>Step 3: Design Rubrics for Question 1</h2>
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
                    <div id="rubric-design">
                        <h2>Step 3: Design Rubrics for Question 1</h2>
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
                    <div id="rubric-design">
                        <h2>Step 3: Design Rubrics for Question 1</h2>
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
                    <div id="rubric-design">
                        <h2>Step 3: Design Rubrics for Question 1</h2>
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
                        <h2>Step 3: Representative Example from cluster {this.state.selectedClusterID}</h2>
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
