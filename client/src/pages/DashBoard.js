import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { Box, Grid, Container, Typography} from "@mui/material";
import {
    CommitNumber,
    IssueNumber,
    StarNumber,
    ForkNumber,
    TimeLine,
    Language,
    CoreContribute,
    CommitFrequency,
    CommiterFrequency,
    IssueFrequency,
    IssuerFrequency,
    IssueResponse,
    IssueClose,
    ContributorList,
} from "../components/DashBoard";
import detail from "../context/staticData"

export default function DashboardApp() {
    useEffect(() => {
        getDashBoard(id);
    }, []);
    

    const { id } = useParams();

    // 使用请求的detail数据
    // const { isLoading, detail, getDashBoard } = useAppContext();

    //使用死数据
    const { isLoading, getDashBoard } = useAppContext();

    const {
        forks,
        stars,
        open_issues,
        timeline,
        language,
        commit_month_frequency,
        commiter_count,
        issue_frequency,
        issuer_frequency,
        response_time,
        contributes,
        monthly_count
    } = detail;

    const [nowYear, setYear] = useState(contributes.coreContributorByYear[0].year)

    if (isLoading) {
        return <Loading center />;
    } else {
        // const contribute = {
        //     name: [],
        //     contributions: [],
        // };

        // if (contributors) {
        //     for (var i = 0; i < Math.min(5, contributors.length); ++i) {
        //         contribute.name.push(contributors[i].name);
        //         contribute.contributions.push(contributors[i].contributions);
        //     }
        // }
        const coreContributeData = {};
        const yearList = [];
        if (contributes) {
            const coreContributeByYear = contributes["coreContributorByYear"];
            for (var i = 0; i < coreContributeByYear.length; i++) {
                var year = coreContributeByYear[i].year;
                var count = 0;
                yearList.push(year);
                coreContributeByYear[i].coreContributor.map((tmp) => { count += tmp.commit; })
                coreContributeData[year] = count;
            }
        }

        const contributeDetail = {
            contributes: contributes,
            contributeYear: nowYear,
        }
        return (
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h4">Report</Typography>
                </Box>
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                            <CommitNumber />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <IssueNumber total={open_issues} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StarNumber total={stars} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ForkNumber total={forks} />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TimeLine {...timeline} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={8}>
                            <Language {...language} />
                        </Grid>
                    </Grid>
                </Box>


                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Commit</Typography>
                </Box>
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <CommitFrequency {...commit_month_frequency} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <CommiterFrequency {...commiter_count} />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Issue</Typography>
                </Box>
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <IssueFrequency {...issue_frequency} />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <IssuerFrequency {...issuer_frequency} />
                        </Grid>
                    </Grid>
                </Box>


                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">pull request</Typography>
                </Box>
                <Box>
                    <Grid container spacing={3}>
                        {/* TODO: pull request相关模块 */}
                    </Grid>
                </Box>

                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">contribute</Typography>
                </Box>
                <Box >
                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <CoreContribute {...coreContributeData} />
                        </Grid>
                        <Grid sx={{maxHeight:"100%"}} item xs={3} >
                            <ContributorList sx={{height:1}} {...contributeDetail} />
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Issue closed and Issue response</Typography>
                </Box>
                <Box>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <IssueResponse {...response_time}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12}>
                            <IssueClose {...monthly_count}/>
                        </Grid>
                    </Grid>
                </Box>

            

                <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                    <Typography variant="h4">Design</Typography>
                </Box>
                <Box>
                    {/* TODO: 设计相关模块 */}
                </Box>
            </Container>
        );
    }
}
