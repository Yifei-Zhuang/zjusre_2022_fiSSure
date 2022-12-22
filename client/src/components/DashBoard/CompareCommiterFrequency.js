import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const CompareCommiterFrequency = (props) => {
    const { repoOwner, repoName, data1, anotherRepoOwner, anotherRepoName, data2 } = props;
    let labels1 = [],
        number1 = [];
    let labels2 = [], number2 = [];
    for (let interval in data1) {
        labels1.push(interval);
    }
    for (let interval in data2) {
        labels2.push(interval);
    }
    let minLabels = labels1[0] < labels2[0] ? labels1 : labels2;
    if (minLabels == labels1) {
        for (let i = 0; i < minLabels.length; i++) {
            number2.push(data2[minLabels[i]] ? data2[minLabels[i]] : 0);
            number1.push(data1[minLabels[i]]);
        }
    } else {
        for (let i = 0; i < minLabels.length; i++) {
            number1.push(data1[minLabels[i]] ? data1[minLabels[i]] : 0);
            number2.push(data2[minLabels[i]]);
        }
    }
    const CHART_DATA = [
        {
            name: `${repoOwner}/${repoName} commiter count`,
            // type: "line",
            data: number1,
        },
        {
            name: `${anotherRepoOwner}/${anotherRepoName} commiter count`,
            // type: "line",
            data: number2,
        }
    ];
    const chartOptions = merge(BaseOptionChart(), {
        chart: {
            type: 'line',
            stacked: false,
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [1, 1, 4]
            },
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        stroke: { width: [3, 2] },
        plotOptions: { bar: { columnWidth: "11%", borderRadius: 4 } },
        labels: minLabels,
        xaxis: {
            categories: [
                ...minLabels,
            ]
        },
        fill: {
            type: "solid",
            fillOpacity: 0.7
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== "undefined") {
                        return `${y.toFixed(0)}`;
                    }
                    return y;
                },
            },
        },
    });

    return (
        <Card>
            <CardHeader title="Commiter change" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <ReactApexChart
                    series={CHART_DATA}
                    options={chartOptions}
                    height={355}
                />
            </Box>
        </Card>
    );
};

export default CompareCommiterFrequency;
