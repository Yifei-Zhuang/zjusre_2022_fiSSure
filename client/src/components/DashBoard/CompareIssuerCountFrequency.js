import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const CompareIssuerCountFrequency = (props) => {
    const { repoOwner, repoName, data1, anotherRepoOwner, anotherRepoName, data2 } = props;
    let labels1 = [],
        number1 = [];
    let labels2 = [], number2 = [];
    for (let interval in data1) {
        labels1.push(interval);
        number1.push(data1[interval]);
    }
    for (let interval in data2) {
        labels2.push(interval);
        number2.push(data2[interval]);
    }
    const CHART_DATA = [
        {
            name: `${repoOwner}/${repoName} issuer count`,
            type: "line",
            data: number1,
        },
        {
            name: `${anotherRepoOwner}/${anotherRepoName} issuer count`,
            type: "line",
            data: number2,
        }
    ];
    console
        .log(CHART_DATA)
    const chartOptions = merge(BaseOptionChart(), {
        chart: {
            id: 'chartIssuerFrequency',
            type: 'line',
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
        labels: labels1,
        xaxis: {
            categories: [
                ...labels1
            ]
        },
        yaxis: [{
            min: 0,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: '#008FFB'
            },
            labels: {
                style: {
                    colors: '#008FFB',
                }
            },
            title: {
                text: `${repoOwner}/${repoName} issuer count`,
                style: {
                    color: '#008FFB',
                }
            },
            tooltip: {
                enabled: true
            }
        }, {
            seriesName: `${anotherRepoOwner}/${anotherRepoName} issuer count`,
            opposite: true,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: '#00E396'
            },
            labels: {
                style: {
                    colors: '#00E396',
                }
            },
            title: {
                text: `${anotherRepoOwner}/${anotherRepoName}  issuer count`,
                style: {
                    color: '#00E396',
                }
            },
        },
        ],
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
        <Card>
            <CardHeader title="Issuer change" />
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

export default CompareIssuerCountFrequency;
