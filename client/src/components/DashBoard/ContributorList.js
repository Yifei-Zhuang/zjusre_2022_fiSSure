import { Icon } from "@iconify/react";
import moment from "moment";
import { Box, Stack, Card, Typography, CardHeader, Chip } from "@mui/material";

function Contributor({ contributor }) {

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ minWidth: 120 }}>
                <a>{contributor["contributor"]}</a>
                {/* <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {description}
        </Typography> */}
            </Box>
            <Typography
                variant="caption"
                sx={{ pr: 3, flexShrink: 0, color: "text.secondary" }}
            >
                commits: {contributor["commit"]}
            </Typography>
        </Stack>
    );
}

const ContributorList = (contributes, contributeYear) => {
    const contributesList = contributes["coreContributorByYear"];
    const Year = 2019;
    let coreContributorList;
    for (var contributeIndex in contributesList){
        if(contributesList[contributeIndex]["year"] == Year){
            coreContributorList = contributesList[contributeIndex]["coreContributor"]
            break;
        }
    }

    return (
        <Card>
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
