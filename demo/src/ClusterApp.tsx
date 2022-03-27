import React from 'react';
import './App.css';


class ClusterApp extends React.Component {
    constructor(props: any){
        super(props);
    }

    render(): React.ReactNode {
        return <div className='view'>
                <h1>{"Step 1:  Design Rubric Based on Clustering"}</h1>
                <div id="cluster">
                    Todo: display clustering results
                </div>
                <div id="rubric-design">
                    Todo: rubric design
                </div>
                <div id="overview">
                    Todo: overview
                </div>
        </div>
    }
}

export  {ClusterApp};
