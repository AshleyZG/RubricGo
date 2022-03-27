import React from 'react';
import './App.css';


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
                    Todo: display clustering results
                    <div id="range-slider">
                        Todo: add a range slider here
                    </div>
                    <div id="cluster-viz">
                        Todo: add cluster visualization
                    </div>
                </div>
                <div id="cluster-analysis">
                    <div id="rubric-design">
                        Todo: rubric design
                    </div>
                    <div id="overview">
                        Todo: overview
                    </div>

                </div>

            </div>
        </div>
    }
}

export  {ClusterApp};
