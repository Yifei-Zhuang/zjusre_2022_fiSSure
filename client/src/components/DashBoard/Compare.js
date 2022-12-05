import { Box, Container, Card, CardHeader, Grid } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import detail from "../../context/staticData";
import Language from "./Language";

const Compare = (compareRepo) => {
    const CHART_DATA = [
        {
            name: compareRepo.compareRepo,
            data: [
                -302487, -16000, -70000, -10000
            ]
        },
        {
            name: detail.owner + "/" + detail.name,
            data: [
                detail.commits, detail.forks, detail.stars, detail.open_issues
            ]
        },

    ];
    const maxValue = Math.max(...CHART_DATA[0].data.concat(CHART_DATA[1].data))

    const chartOptions = {
        chart: {
            stacked: true
        },
        colors: ['#008FFB', '#FF4560'],
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '80%',
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 1,
            colors: ["#fff"]
        },

        grid: {
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        yaxis: {
            min: -1 * maxValue,
            max: maxValue,
            title: {
                text: 'Data Type',
            },
        },
        tooltip: {
            shared: false,
            x: {
                formatter: function (val) {
                    return val
                }
            },
            y: {
                formatter: function (val) {
                    return Math.abs(val / 1000) + "K";
                }
            }
        },
        title: {
            text: 'Details Compare'
        },
        xaxis: {
            categories: [
                'Commits', 'Forks', 'Stars', 'Open Issues'
            ],
            title: {
                text: 'Data Type'
            },
            labels: {
                formatter: function (val) {
                    return Math.abs(val / 1000) + "K"
                }
            }
        },

    };

    const newLanguage = {
        "language": {
            "JavaScript": 41265613,
            "Python": 21265613,
            "C": 12323427,
            "Java": 1255817,
            "Objective-C++": 950926,
            "CMake": 850926,
            "Starlark": 373085,
            "Assembly": 336348,
            "Shell": 313149,
            "Jupyter Notebook": 180959,
            "PureBasic": 115115,
            "GLSL": 112841,
            "Metal": 42755,
            "Batchfile": 24330,
            "Dockerfile": 23337,
            "Objective-C": 21798,
            "Jinja": 14139,
            "Ruby": 10645,
            "HTML": 5893,
            "Makefile": 5688,
            "PowerShell": 5075,
            "Yacc": 3848,
            "CSS": 2409,
            "LLVM": 1605,
            "GDB": 653,
            "Vim Script": 154
        },
    }

    return (
        <Container maxWidth="xl">
            <ReactApexChart
                series={CHART_DATA}
                options={chartOptions}
                height='auto'
                type='bar'
            />
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={6} >
                        <Card>
                            <CardHeader title={detail.owner + "/" + detail.name + " Language"} />
                            <Language {...detail.language} />
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardHeader title={compareRepo.compareRepo + " Language"} />
                            <Language {...newLanguage.language} />
                        </Card>
                    </Grid>
                </Grid>
            </Box>

        </Container>
    )
}

export default Compare;