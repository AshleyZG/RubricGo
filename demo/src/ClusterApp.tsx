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
    similarItems: {[id: number]: clusterItem};
    errorItems: {[id: number]: clusterItem};
    selectedClusterID: number | undefined;
    clusteredData: PlainObject;
};

class ClusterApp extends React.Component<ClusterAppProps, ClusterAppState> {
    constructor(props: any){
        super(props);
        this.state = {
            clusteredAnswers: [],
            clusterItems: {},
            errorItems: {},
            similarItems: {},
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
        fetch("http://localhost:5001/distantResult")
        .then((response) => {
			if (!response.ok){
				throw new Error('Something went wrong');
			}
			return response.json();
        })
        .then((data) => {
            var errorItems: {[id:number]: clusterItem} = {};
            var similarItems: {[id:number]: clusterItem} = {};
            data.similarContent.forEach((value: any) => {
                errorItems[value.cluster] = {id: value.cluster, items: []};
                similarItems[value.cluster] = {id: value.cluster, items: []};
                errorItems[value.cluster].items.push(value.answer[0]);
                for (let i = 1; i < 6; i++){
                    similarItems[value.cluster].items.push(value.answer[i]);
                }
            })
            this.setState({
                similarItems: similarItems,
                errorItems: errorItems,
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
        return  <div className='view'>
        <div className='sidebar'>
            <div className='logo'>

            </div>
            <div className='title'>
                <h2>Question: Please describe one rule for ideation in human-centered design.</h2>
                <p>
                    Student submissions:111
                </p>
                <h2>Cluster Result</h2>
                <div>
                <h3>Here are x clusters in total when you set the distance threshold as x
                    {this.state.selectedClusterID}</h3>
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
                        value={this.state.selectedClusterID===undefined? "Representative example 1 in cluster x:": this.state.clusterItems[this.state.selectedClusterID].items[2]}
                        readOnly
                    />
                    <Input
                        style={{width: "80%", height: "40px",background: "#C15BB117"}}
                        value={this.state.selectedClusterID===undefined? "Representative example 2 in cluster x:": this.state.clusterItems[this.state.selectedClusterID].items[3]}
                        readOnly
                    />
                </div>
                <div id="cluster-viz">
                    <Viz data={this.state.clusteredData}/>
                </div>

            </div>
           
            </div>
        <div className='content'>
        <div className='title'>
                <h1>Step 1:  Understand different student answer groups </h1>
                <p>We present some student answer groups to help you get an overview of the students answers. Similar answers can be clustered in one group through AI algorithms. </p>

                <p>You could adjust the clustering outcome through setting the distance threshold among groups. You can adjust the distance threshold by observing the cluster visualization. 
                   In the figure, each point represents one student answer, and If you find that all the answers are close to each other in one answer group, this means you get a good cluster outcome. 
                   Then you can stop adjusting the distance threshold  and start to understand students' answers in each cluster.    </p>

            </div>
            <div id="cluster">
                <p>Distance defines how diverse student submissions could be divided in different clusters. If the distance is 0, this means only totally same answers can be grouped together. And 
                    when the distance is longer, two answers within the distance can be in one group, otherwise, they will divided into different groups.
                </p>
                <div id="range-slider" style={{display: "inline-block", width: "70%"}}>
                <span style={{display: "inline-block"}}>Set the Distance threshold: </span>
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

                
            </div>
            <div id="cluster-analysis">
                <div id="rubric-design">
                    <h1>Step 2: Design Rubrics for Question 1</h1>
                    <p>Note: Now, you have a general understanding of the student answers, so that you could design rubrics more equitable</p>
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

                    </form>
                    <p></p>
                        <Button variant="outlined" size="small" type="submit">Submit</Button>
                </div>
                <div id="overview">
                <div>
                <h1>Step 3: Grade student answers by group
                    </h1>
                    {
                    Object.values(this.state.clusterItems).map((value: clusterItem, index: number) => {
                        return  <Button variant="outlined" size="small" key={index} onClick={this.selectCluster} 
                            data-id={value.id} 
                        >cluster {value.id}</Button>
                    })}
                </div>

                    
                    <form>
                    <p></p>
                    <Stack direction="row" spacing={2}>
                        <Button color="secondary">Grade Group {this.state.selectedClusterID}</Button>
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

            <div id="ErrorSubmission">
                <h1>Step 4: Check the AI-based Grading</h1>
                <p>
                    In the previous step, you graded the students answer based on different student answer groups. Since there might be some answers that are similar with 
                    other answers in the group to some extent, but there are some nuanced difference among them. Here, we presented some answers that might be have nuanced differences with other answers
                    in one group, you can double-check them to make the grading more accurately.
                </p>
                <h2>Potential Error Submission from cluster {this.state.selectedClusterID}</h2>
                <div>
                    {Object.values(this.state.errorItems).map((value: clusterItem, index: number) => {
                        return  <Button  variant="outlined" size="medium" key={index} onClick={this.selectCluster}
                            data-id={value.id}
                        >cluster {value.id}</Button>
                    })}
                </div>
                <div>
                    <Input
                        style={{width: "90%", height: "60px",background: "#C15BB1A6"}}
                        value={this.state.selectedClusterID===undefined? "Click the cluster button to see the potential error submission": this.state.errorItems[this.state.selectedClusterID].items[0]}
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
            <div id="SimilarSubmission">
                <h2>Similar submissions that could potentially be influenced by the re-grading</h2>
                    <Input
                        style={{width: "90%", height: "40px",background: "#C15BB117"}}
                        value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[0]}
                    />
                    <Input
                        style={{width: "90%", height: "40px",background: "#C15BB117"}}
                        value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[1]}
                    />
                    <Input
                        style={{width: "90%", height: "40px",background: "#C15BB117"}}
                        value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[2]}
                    />
                    <Input
                        style={{width: "90%", height: "40px",background: "#C15BB117"}}
                        value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[3]}
                    />
                    <Input
                        style={{width: "90%", height: "40px",background: "#C15BB117"}}
                        value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[4]}
                    />
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
            </div>
            </div>
        </div>
    </div>

    }
}

export  {ClusterApp};
