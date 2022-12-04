import { useState } from "react";
import { ToggleButtonGroup, ToggleButton, autocompleteClasses } from "@mui/material";
import { Box, Grid, Stack, Card, Typography, CardHeader, Chip } from "@mui/material";
import BaseOptionChart from "./BaseOptionChart";
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";

const CoreContribute = (data) => {
    var labels = [],
        number = [];
    for (var interval in data.data) {
        labels.push(interval);
        number.push(data.data[interval]);
    }
    const CHART_DATA = [
        {
            name: "comtribute times",
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
        <Card>
            <CardHeader title="CoreContribute times" />
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

const ContributorList = (data) => {
    const [coreContributeYear, setYear] = useState(data[0].year);

    const yearList = [];
    for(var i in data){
        yearList.push(data[i].year);
    }

    let coreContributorList = [];
    for(var i in data){
        if(data[i].year == coreContributeYear){
            coreContributorList = data[i].coreContributor;
            break;
        }
    }

    return (
        <Card>
            <ToggleButtonGroup
                sx={{ width: "100%" }}
                color="primary"
                value={coreContributeYear}
                exclusive
            >
                {
                    yearList.map((year) => {
                        return (
                            <ToggleButton sx={{ width: "25.25%" }} key={year} value={year} onClick={(event, value) => {
                                setYear(value);
                            }}>
                                {year}
                            </ToggleButton>
                        )
                    })
                }
            </ToggleButtonGroup>
            <CardHeader title="Contributors List" />
            <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
                {coreContributorList.map((coreContributor) => {
                    return (
                        <Contributor key={coreContributor["contributor"]} contributor={coreContributor} />
                    );
                })}
            </Stack>
        </Card>
    );
};

function Contributor({ contributor }) {

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: "50%" }}>
                <a>{contributor["contributor"]}</a>
                {/* <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {description}
        </Typography> */}
            </Box>
            <Typography
                sx={{ mr: 1, flexShrink: 0, color: "text.secondary" }}
            >
                commits: {contributor["commit"]}
            </Typography>
        </Stack>
    );
}

const Contribute = (data) => {

    const yearCoreContributorCount = {};
    for(var i in data){
        var sum = 0;
        for(var j in data[i].coreContributor){
            sum += data[i].coreContributor[j].commit;
        }
        yearCoreContributorCount[data[i].year] = sum;
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={9}>
                <CoreContribute data={yearCoreContributorCount} />
            </Grid>
            <Grid sx={{ maxHeight: "100%" }} item xs={3} >
                <ContributorList {...data}  />
            </Grid>
        </Grid>
    );
};

export default Contribute;
