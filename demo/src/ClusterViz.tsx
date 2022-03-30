import React from 'react'
import ReactDOM from 'react-dom'
import { PlainObject, VegaLite, VisualizationSpec } from 'react-vega'



const barData = {
  table: [
    { x: 28, y: 28, text: "hello"},
    { x: 55, y: 55, text: "hello"},
    { x: 43, y: 43, text: "hello"},
    { x: 91, y: 91, text: "hello"},
    { x: 81, y: 81, text: "hello"},
    { x: 53, y: 53, text: "hello"},
    { x: 19, y: 19, text: "hello"},
    { x: 87, y: 87, text: "hello"},
    { x: 52, y: 52, text: "hello"},
  ],
}

export interface DataItem{
    x: number,
    y: number,
    text: string
}
export interface Data{
    table: DataItem[];
}
interface VizProps{
};
interface VizState{
    data: PlainObject;
};

class Viz extends React.Component<VizProps, VizState>{

    spec: VisualizationSpec;
    
    constructor(props: any){
        super(props);

        this.spec = {
              width: 400,
              height: 300,
              description: "A scatterplot showing horsepower and miles per gallons for various cars.",
              data: {name: 'table'},
              mark: "point",
              encoding: {
                x: {field: "x", type: "quantitative"},
                y: {field: "y", type: "quantitative"},
                tooltip: {field: "text", type: "nominal"},
                color: {field: "color", scale: {scheme: "tableau10"}, type: "nominal"}
              }
        }

        this.state = {
            data: {table: []},
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
            var dataItems: any[] = [];
            data.clusteredAnswers.forEach((value: any) => {
                dataItems.push({x: value.x_position, y: value.y_position, text: value.text, color: value.agg_bert_row});
            })
            this.setState({
                data: {table: dataItems},
            });
        })
    }

    render(){
        console.log(this.state.data)
        return (
            <VegaLite spec={this.spec} data={this.state.data} />
        )    
    }
}


export {Viz};
