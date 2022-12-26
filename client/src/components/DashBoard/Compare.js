import { Box, Container, Card, CardHeader, Grid, Typography, Divider } from "@mui/material";
import ReactApexChart from "react-apexcharts";

import detail from "../../context/staticData";
import CompanyBubbleChart from "./CompanyBubbleChart";
import CompareCommiterFrequency from "./CompareCommiterFrequency";
import CompareCommitFrequency from "./CompareCommitFrequency";
import CompareIssuerCountFrequency from "./CompareIssuerCountFrequency";
import ComparePullerCountFrequency from "./ComparePullerCountFrequency";
import Language from "./Language";
import Loading from '../Loading'
import { useAppContext } from "../../context/appContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Compare = (compareRepo) => {
    const { compareId, currentId } = compareRepo;
    const [anotherRepoDetail, setAnotherRepoDetail] = useState(null);
    const [currentRepoDetail, setCurrentRepoDetail] = useState(null);
    const [fetching, setFetching] = useState(true);
    useEffect(() => {
        setFetching(true);
        const f = async () => {
            // TODO 使用统一的baseURL
            let { data } = await axios({
                url: "http://localhost:4538/dashboard",
                method: "post",
                data: {
                    id: compareId
                }
            })
            setAnotherRepoDetail(data);
            const cdata = await axios({
                url: "http://localhost:4538/dashboard",
                method: "post",
                data: {
                    id: currentId
                }
            })
            setCurrentRepoDetail(cdata.data);
        }
        f();
    }, [])
    useEffect(() => {
        if (currentRepoDetail && anotherRepoDetail) {
            setFetching(false);
        }
    }, [currentRepoDetail])

    if (fetching || !currentRepoDetail || !anotherRepoDetail) {
        return (
            <Loading center />
        )
    } else {
        console.log(1, anotherRepoDetail, currentRepoDetail)
        const CHART_DATA = [
            {
                name: currentRepoDetail.owner + "/" + currentRepoDetail.name,

                data: [
                    currentRepoDetail.commits, currentRepoDetail.forks, currentRepoDetail.stars, currentRepoDetail.open_issues
                ]
            },
            {
                name: anotherRepoDetail.owner + "/" + anotherRepoDetail.name,
                data: [
                    anotherRepoDetail.commits, anotherRepoDetail.forks, anotherRepoDetail.stars, anotherRepoDetail.open_issues
                ]
            },
        ];
        const maxValue = Math.max(...CHART_DATA[0].data) + Math.max(...CHART_DATA[1].data)

        const chartOptions = {
            chart: {
                type: 'bar',
                stacked: true,
                toolbar: {
                    show: false
                }
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
                // min: -1 * maxValue,
                min: 0,
                max: maxValue,
                title: {
                    text: 'Data Type',
                },
                labels: {
                    show: true,
                    trim: false
                }
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
            language: anotherRepoDetail.language
        }
        return (
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Card>
                            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                                <ReactApexChart
                                    series={CHART_DATA}
                                    options={chartOptions}
                                    height='auto'
                                    type='bar'
                                />
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={6} >
                        <Card>
                            <CardHeader title={detail.owner + "/" + detail.name + " Language"} />
                            <Language {...currentRepoDetail.language} />
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardHeader title={compareRepo.compareRepo + " Language"} />
                            <Language {...newLanguage.language} />
                        </Card>
                    </Grid>
                </Grid>

                {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}
                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Commit Compare</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                        <CompareCommitFrequency sx={{
                            marginTop: 3,
                        }} repoOwner={currentRepoDetail.owner} repoName={currentRepoDetail.name} anotherRepoOwner={anotherRepoDetail.owner} anotherRepoName={anotherRepoDetail.name} data1={currentRepoDetail.commit_month_frequency} data2={anotherRepoDetail.commit_month_frequency} />
                        <Divider />
                    </Grid>

                    {/* 
                //TODO 将输入的数据改为后端获取的数据
                */}
                    <Grid item xs={12} sm={12} md={12}>
                        <CompareCommiterFrequency repoOwner={currentRepoDetail.owner} repoName={currentRepoDetail.name} anotherRepoOwner={anotherRepoDetail.owner} anotherRepoName={anotherRepoDetail.name} data1={currentRepoDetail.commiter_count} data2={anotherRepoDetail.commiter_count} />
                    </Grid>
                </Grid>
                {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}

                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Issue Compare</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                        <CompareIssuerCountFrequency repoOwner={currentRepoDetail.owner} repoName={currentRepoDetail.name} anotherRepoOwner={anotherRepoDetail.owner} anotherRepoName={anotherRepoDetail.name} data1={currentRepoDetail.Issuer_count} data2={anotherRepoDetail.Issuer_count} />
                    </Grid>
                </Grid>

                {/* 
               //TODO 将输入的数据改为后端获取的数据
            */}
                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Pull Request Compare</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={12}>
                        <ComparePullerCountFrequency repoOwner={currentRepoDetail.owner} repoName={currentRepoDetail.name} anotherRepoOwner={anotherRepoDetail.owner} anotherRepoName={anotherRepoDetail.name} data1={currentRepoDetail.puller_count} data2={anotherRepoDetail.puller_count} />
                    </Grid>
                </Grid>
                {/* 公司占比 */}
                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Contribution Percentage of Company</Typography>
                </Box>
                <Box>
                    <CompanyBubbleChart repoOwner={currentRepoDetail.owner} repoName={currentRepoDetail.name} anotherRepoOwner={anotherRepoDetail.owner} anotherRepoName={anotherRepoDetail.name} coreContributorByYear={currentRepoDetail.coreContributorByYear} anotherRepoCoreContributorByYear={anotherRepoDetail.coreContributorByYear} isComparing={true} />
                </Box>
            </Container>
        )
    }
}

export default Compare;