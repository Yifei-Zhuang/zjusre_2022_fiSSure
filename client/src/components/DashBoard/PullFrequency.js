import { merge } from 'lodash';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, Button, Popover, List, ListItemButton } from '@mui/material';
//
import BaseOptionChart from './BaseOptionChart';
import { useState } from 'react';

// ----------------------------------------------------------------------

const PullFrequency = data => {
    // 定制表格显示数据
    const [anchorEl, setAnchorEl] = useState(null);
    const issueDataTypes = [
        'pull_year_create_frequency',
        'pull_year_close_frequency',
        'pull_year_update_frequency',
        'pull_month_create_frequency',
        'pull_month_close_frequency',
        'pull_month_update_frequency',
        'puller_count',
    ]
    const [currentType, setCurrentType] = useState(issueDataTypes[0]);
    const listItems = issueDataTypes.map((type) => {
        return (
            <ListItemButton key={type} onClick={() => setCurrentType(type)} selected={type === currentType}>{type}</ListItemButton>
        )
    });

    var labels = [],
        number = [];
    for (var interval in data[currentType]) {
        labels.push(interval);
        number.push(data[currentType][interval]);
    }
    const CHART_DATA = [
        {
            name: currentType,
            type: 'area',
            data: number,
        },
    ];
    const chartOptions = merge(BaseOptionChart(), {
        stroke: { width: [3, 2] },
        plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
        fill: { type: ['gradient'] },
        labels: labels,
        xaxis: { type: 'datetime' },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: y => {
                    if (typeof y !== 'undefined') {
                        return `${y.toFixed(0)}`;
                    }
                    return y;
                },
            },
        },
    });
    return (
        <Box position={'relative'}>
            <Card>
                <CardHeader title={currentType.toUpperCase()} />
                <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                    <Button
                        sx={{
                            position: 'absolute',
                            right: '1em',
                            top: '1em',
                        }} aria-describedby={'__pullType'} variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        select type
                    </Button>
                    <Popover
                        id={'__pullType'}
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
                    <ReactApexChart
                        type="line"
                        series={CHART_DATA}
                        options={chartOptions}
                        height={364}
                    />
                </Box>
            </Card>
        </Box>
    );
};

export default PullFrequency;
