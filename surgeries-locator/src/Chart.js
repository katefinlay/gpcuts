import React from 'react';
import { XYPlot, XAxis, YAxis, makeWidthFlexible, HorizontalGridLines, LineSeries, VerticalGridLines } from 'react-vis';
import { extent } from 'd3-array';
import "react-vis/dist/style.css";

const Chart = (props) => {
    const { total_patients, total_gp_fte } = props;
    const FlexibleXYPlot = makeWidthFlexible(XYPlot); 

    const data = Object.keys(total_gp_fte).map(key => {
        if (total_patients[key] == null) {
            return null;
        }
        const patients = total_patients[key];
        const gps = total_gp_fte[key];
        const patientsPerGP = Math.round(patients / gps);
        if (isNaN(patientsPerGP)) {
            return null;
        }
        return ({ x: parseInt(key), y: Math.round(patients / gps) });
    }).filter(x => x != null);

    const xDomain = extent(data, (d) => d.x);
    const yDomain = extent(data, (d) => d.y);

    return (
        <FlexibleXYPlot xType="time" width={600} height={300} xDomain={xDomain}>
            <LineSeries data={data} />
            <XAxis />
            <YAxis yDomain={yDomain} yBaseValue={yDomain[0]}/>
        </FlexibleXYPlot>
    );
}

export default Chart;