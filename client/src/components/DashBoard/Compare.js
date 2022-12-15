import { Box, Container, Card, CardHeader, Grid, Typography, Divider } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import detail from "../../context/staticData";
import CompanyBubbleChart from "./CompanyBubbleChart";
import CompareCommiterFrequency from "./CompareCommiterFrequency";
import CompareCommitFrequency from "./CompareCommitFrequency";
import CompareIssuerCountFrequency from "./CompareIssuerCountFrequency";
import ComparePullerCountFrequency from "./ComparePullerCountFrequency";
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
            {/* 公司占比 */}
            <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                <Typography variant="h4">公司贡献占比</Typography>
            </Box>
            <Box>
                <CompanyBubbleChart repoOwner={detail.owner} repoName={detail.name} coreContributorByYear={detail.coreContributorByYear} isComparing={true} anotherRepoOwner={compareRepo.compareRepo.split('/')[0]} anotherRepoName={compareRepo.compareRepo.split('/')[1]} anotherRepoCoreContributorByYear={detail.coreContributorByYear} />
            </Box>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                        <ReactApexChart
                            series={CHART_DATA}
                            options={chartOptions}
                            height='auto'
                            type='bar'
                        />
                    </Grid>
                </Grid>
            </Box>
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
            {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}
            <CompareCommitFrequency sx={{
                marginTop: 3,
            }} repoOwner={detail.owner} repoName={detail.name} anotherRepoOwner={compareRepo.compareRepo.split('/')[0]} anotherRepoName={compareRepo.compareRepo.split('/')[1]} data1={detail.commit_month_frequency} data2={detail.commit_month_frequency} />
            <Divider />
            {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}
            <CompareCommiterFrequency repoOwner={detail.owner} repoName={detail.name} anotherRepoOwner={compareRepo.compareRepo.split('/')[0]} anotherRepoName={compareRepo.compareRepo.split('/')[1]} data1={detail.commiter_count} data2={detail.commiter_count} />
            {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}
            <CompareIssuerCountFrequency repoOwner={detail.owner} repoName={detail.name} anotherRepoOwner={compareRepo.compareRepo.split('/')[0]} anotherRepoName={compareRepo.compareRepo.split('/')[1]} data1={detail.Issuer_count} data2={detail.Issuer_count} />
            {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}
            <ComparePullerCountFrequency repoOwner={detail.owner} repoName={detail.name} anotherRepoOwner={compareRepo.compareRepo.split('/')[0]} anotherRepoName={compareRepo.compareRepo.split('/')[1]} data1={detail.puller_count} data2={detail.puller_count} />
        </Container>
    )
}

export default Compare;