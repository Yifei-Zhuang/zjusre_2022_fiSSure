import { useState } from "react";
import { ToggleButtonGroup, ToggleButton, autocompleteClasses } from "@mui/material";
import { Box, Stack, Card, Typography, CardHeader, Chip } from "@mui/material";

function Contributor({ contributor }) {

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ width: 140 }}>
                <a>{contributor["contributor"]}</a>
                {/* <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {description}
        </Typography> */}
            </Box>
            <Typography
                variant="caption"
                sx={{ pl: 4, flexShrink: 0, color: "text.secondary" }}
            >
                commits: {contributor["commit"]}
            </Typography>
        </Stack>
    );
}

const ContributorList = ({ contributes }) => {
    const contributesList = contributes["coreContributorByYear"];
    const [coreContributeYear,setYear] = useState(contributes.coreContributorByYear[0].year);
    const yearList = [];
    for(var i in contributes.coreContributorByYear){
        yearList.push(contributes.coreContributorByYear[i].year)
    }
    let coreContributorList;
    for (var contributeIndex in contributesList) {
        if (contributesList[contributeIndex]["year"] == coreContributeYear) {
            coreContributorList = contributesList[contributeIndex]["coreContributor"];
            break;
        }
    }

    return (
        <Card>
            <ToggleButtonGroup
                sx={{width:"100%"}}
                color="primary"
                value={coreContributeYear}
                exclusive
                onChange={(event, value) => { setYear(value); }}
            >
                {
                    yearList.map((year) => {
                        return (
                            <ToggleButton sx={{width:"25.25%"}} key={year} value={year}>{year}</ToggleButton>
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

export default ContributorList;
