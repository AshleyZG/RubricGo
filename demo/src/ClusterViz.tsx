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
    data: PlainObject;
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
                color: {
                    condition: {
                        param: "cluster",
                        field: "color", scale: {scheme: "tableau10"}, type: "nominal"
                    },
                    value: "gray"
            }
            },
            params: [
                {
                    name: "cluster",
                    select: {
                        type: "point",
                        fields: ["color"],
                        on: "click",
                        // resolve: "global",
                        // empty: "all"
                    },
                    bind: {
                        input: "select",
                        options: [null, 0,1,2,3,4,5,6,7,8,9,10],
                        // fields: ["color"]
                    },


                }
            ]
        }

        this.state = {
            data: {table: []},
        }

    }


    render(){
        return (
            <VegaLite spec={this.spec} data={this.props.data} />
        )    
    }
}


export {Viz};
