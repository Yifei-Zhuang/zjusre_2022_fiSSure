import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';
import { Card, CardHeader, Box, Button, Popover, List, ListItemButton } from '@mui/material';
require("highcharts/highcharts-more")(Highcharts);

const CompanyBubbleChart = (props) => {
    const { repo_owner, repo_name, coreContributorByYear } = props;
    // 定制表格显示数据
    const [anchorEl, setAnchorEl] = useState(null);
    const dataByYears = coreContributorByYear.map(item => {
        return {
            year: item.year,
            data: item.coreContributorCompany.map(company => {
                // console.log(company)
                return {
                    name: company.company,
                    value: company.coreContributors
                }
            })
        }
    })
    let map = new Map()
    dataByYears.forEach(item => {
        map.set(item.year, item.data)
    })
    const [currentType, setCurrentType] = useState(2019);
    const listItems = dataByYears.map((item) => {
        return (
            <ListItemButton key={item.year} onClick={() => setCurrentType(item.year)} selected={item.year === currentType}>{item.year}</ListItemButton>
        )
    });
    const data = [{
        name: `${repo_owner}/${repo_name}`,
        data: map.get(currentType)
    }]

    const options = {
        chart: {
            type: 'packedbubble',
            height: '100%',
        },
        title: {
            text: 'Contribution Percentage of Company',
        },
        tooltip: {
            useHTML: true,
            pointFormat: '{point.name}: {point.value}'
        },
        plotOptions: {
            packedbubble: {
                minSize: '60%',
                maxSize: '600%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    splitSeries: false,
                    gravitationalConstant: 0.02
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name:\n point.value}',
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: data, // 传入的数据
    };
    return (
        <Box sx={{
            display: 'relative',
        }}>
            <Card>
                <Button
                    sx={{
                        // position: 'absolute',
                        marginLeft: 'calc(100% - 10em)',
                        right: '1em',
                        top: '1em',
                    }} aria-describedby={'__year'} variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
                    select year
                </Button>
                <Popover
                    id={'__year'}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <List>
                        {listItems}
                    </List>
                </Popover>
                <Box marginTop={'2em'}>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Box>
            </Card>
        </Box>
    )
}
export default CompanyBubbleChart;
