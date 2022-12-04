import { Box, Container, Typography, Button } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import BaseOptionChart from "./BaseOptionChart";
import { merge } from "lodash";

const Compare = () => {
    var labels = [], number = [];
    const CHART_DATA = [
        {
            name: "comtributors",
            type: "area",
            data: number,
        },
    ];
    const chartOptions = merge(BaseOptionChart(), {
        chart: {
            type: 'area',
            stacked: false,
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
        fill: { type: ["gradient", "solid"] },
        labels: labels,
        xaxis: {
            categories: [
                ...labels
            ]
        },
        tooltip: {
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
        <ReactApexChart
            series={CHART_DATA}
            options={chartOptions}
            height={355}
        />
    )
}

export default Compare;