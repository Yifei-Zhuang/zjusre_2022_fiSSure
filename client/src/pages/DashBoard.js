import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { Card, CardHeader, Box, Grid, Container, Typography, 
    Button, InputLabel, FormControl, Select, MenuItem } from "@mui/material";
import {
    CommitNumber,
    IssueNumber,
    StarNumber,
    ForkNumber,
    TimeLine,
    Language,
    Contribute,
    CommitFrequency,
    CommiterFrequency,
    IssueFrequency,
    IssuerFrequency,
    IssueResponse,
    IssueClose,
    PullFrequency,
    PullerFrequency,
    Compare,
    HeatMap,
    CompanyBubbleChart
} from "../components/DashBoard";
import detail from "../context/staticData"

export default function DashboardApp() {
    // 暂时关闭从后端获得数据
    // useEffect(() => {
    //     getDashBoard(id);
    // }, []);


    const { id } = useParams();


    // 使用请求的detail数据
    // const { isLoading, detail, getDashBoard, repos } = useAppContext();

    //使用死数据
    const { isLoading, getDashBoard, repos } = useAppContext();
    const [visible, setVisible] = useState(false);
    const [compareRepo, setCompareRepo] = useState("");
    const {
        name,
        owner,
        forks,
        stars,
        open_issues,
        timeline,
        language,
        commit_month_frequency,
        commiter_count,
        issue_frequency,
        Issuer_count,
        issue_year_create_frequency,
        Issue_year_update_frequency,
        Issue_year_close_frequency,
        Issue_month_create_frequency,
        Issue_month_update_frequency,
        Issue_month_close_frequency,
        pull_year_create_frequency,
        pull_year_close_frequency,
        pull_year_update_frequency,
        pull_month_create_frequency,
        pull_month_close_frequency,
        pull_month_update_frequency,
        puller_count,
        response_time,
        coreContributorByYear,
        monthly_count
    } = detail;



    if (isLoading) {
        return <Loading center />;
    } else {
        const IssueFrequencyDatas = {
            issue_year_create_frequency,
            Issue_year_update_frequency,
            Issue_year_close_frequency,
            Issue_month_create_frequency,
            Issue_month_update_frequency,
            Issue_month_close_frequency,
        }
        const PullFrequencyDatas = {
            pull_year_create_frequency,
            pull_year_close_frequency,
            pull_year_update_frequency,
            pull_month_create_frequency,
            pull_month_close_frequency,
            pull_month_update_frequency,
        }
        return (
            visible ? (
                <Container maxWidth="xl">
                    <Box sx={{ pb: 5, display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h4">Compare To {compareRepo}</Typography>
                        <Button
                            variant="contained" sx={{ mr: "0%" }}
                            onClick={() => {
                                setVisible(false);
                                console.log(visible);
                            }}>
                            Report
                        </Button>
                    </Box>
                    <Compare compareRepo={compareRepo} />
                </Container>

            )
                :
                (
                    <Container maxWidth="xl">
                        <Box sx={{ pb: 5, display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h4">Report</Typography>
                            <div>
                                <FormControl variant="standard" sx={{ mt: "-10px", mr: "20px", minWidth: 240 }}>
                                    <InputLabel id="demo-simple-select-filled-label">Repo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={compareRepo}
                                        onChange={(event) => { setCompareRepo(event.target.value) }}
                                    >
                                        {
                                            repos.map(
                                                (repo) => {
                                                    return (
                                                        <MenuItem
                                                            value={repo.owner + "/" + repo.name}
                                                            key={repo.owner + "/" + repo.name}
                                                        >
                                                            {repo.owner + "/" + repo.name}
                                                        </MenuItem>
                                                    )
                                                }
                                            )
                                        }
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained" sx={{ mr: "0%" }}
                                    onClick={() => {
                                        setVisible(true);
                                        console.log(visible);
                                    }}>
                                    Compare
                                </Button>
                            </div>
                        </Box>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <CommitNumber data={commit_month_frequency} />
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
                                    <Card>
                                        <CardHeader title="Language" />
                                        <Language {...language} />
                                    </Card>
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
                                    <IssueFrequency {...IssueFrequencyDatas} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <IssuerFrequency {...Issuer_count} />
                                </Grid>
                            </Grid>
                        </Box>


                        <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                            <Typography variant="h4">pull request</Typography>
                        </Box>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <PullFrequency {...PullFrequencyDatas} />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <PullerFrequency {...puller_count} />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                            <Typography variant="h4">contribute</Typography>
                        </Box>
                        <Box sx={{ height: 520, width: '100%' }}>
                            <Contribute {...coreContributorByYear} />
                        </Box>
                        <CompanyBubbleChart repo_owner={owner} repo_name={name} coreContributorByYear={coreContributorByYear} />

                        <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                            <Typography variant="h4">Issue closed and Issue response</Typography>
                        </Box>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <IssueResponse {...response_time} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <IssueClose {...monthly_count} />
                                </Grid>
                            </Grid>
                        </Box>



                        <Box sx={{ paddingTop: 3, paddingBottom: 1 }}>
                            <Typography variant="h4">HeatMap</Typography>
                        </Box>
                        <Box>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={12}>
                                    <HeatMap />
                                </Grid>

                            </Grid>
                        </Box>

                    </Container>
                )

        );
    }
}
