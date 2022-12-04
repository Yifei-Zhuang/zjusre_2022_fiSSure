import { Icon } from "@iconify/react";
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
import { fShortenNumber } from "../../utils/formatNumber";

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: "none",
    textAlign: "center",
    padding: theme.spacing(5, 0),
    color: theme.palette.error.dark,
    backgroundColor: theme.palette.error.lighter,
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
    margin: "auto",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    color: theme.palette.error.dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(
        theme.palette.error.dark,
        0
    )} 0%, ${alpha(theme.palette.error.dark, 0.24)} 100%)`,
}));


export default function CommitNumber(data) {
    var total = 0;
    var commits = data.data;
    for(var i in commits){
        total += commits[i];
    }
    return (
        <RootStyle>
            <IconWrapperStyle>
                <Icon icon="bx:bx-git-commit" width={24} height={24} />
            </IconWrapperStyle>
            <Typography variant="h3">{fShortenNumber(total)}</Typography>
            <Typography variant="subtitle2">Commits</Typography>
        </RootStyle>
    );
}
