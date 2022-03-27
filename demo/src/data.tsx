
export interface rubricItem{
    point: number;
    defaultValue: string;
    index?: number;
};

export const rubricItems: rubricItem[] = [
    {
        point: 10,
        defaultValue: ""
    },
    {
        point: 6,
        defaultValue: ""
    },
    {
        point: 2,
        defaultValue: ""
    },
];


export interface clusterItem{
    id: number;
    items: string[];

}
export const clusterItems = [
    {
        id: 0,
        items: []
    },
    {
        id: 1,
        items: []
    },
    {
        id: 2,
        items: []
    }
];

