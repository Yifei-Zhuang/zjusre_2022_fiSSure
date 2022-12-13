import { merge } from 'lodash';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, Button, Popover, List, ListItemButton } from '@mui/material';
//
import BaseOptionChart from './BaseOptionChart';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

const IssueFrequency = data => {
  // 定制表格显示数据
  const [anchorEl, setAnchorEl] = useState(null);
  const issueDataTypes = [
    'issue_frequency',
    'issue_year_create_frequency',
    'Issue_year_update_frequency',
    'Issue_year_close_frequency',
    'Issue_month_create_frequency',
    'Issue_month_update_frequency',
    'Issue_month_close_frequency',
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
    chart: {
      id: 'chartIssueFrequency',
      type: 'line',
      stacked: true,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    stroke: { width: [3, 2] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['gradient'] },
    labels: labels,
    xaxis: {
      categories: [
        ...labels
      ]
    },
    yaxis: [{
      min: 0,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#008FFB'
      },
      labels: {
        style: {
          colors: '#008FFB',
        }
      },
      title: {
        text: currentType.split('_').map(i => i.toUpperCase()).join(' '),
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
    },
    ],
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
  const bottomChartOptions = merge(BaseOptionChart(), {
    chart: {
      id: "_chartCommiterFrequency",
      height: 130,
      type: "bar",
      foreColor: "#ccc",
      brush: {
        target: "chartIssueFrequency",
        enabled: true
      },
      selection: {
        enabled: true,
        fill: {
          color: "#fff",
          opacity: 0.4
        },
      }
    },
    colors: ["#FF0080"],
    series: [
      {
        data: data
      }
    ],
    stroke: {
      width: 2
    },
    grid: {
      borderColor: "#444"
    },
    markers: {
      size: 0
    },
    xaxis: {
      categories: [
        ...labels
      ],
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      tickAmount: 2
    }
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
            }} aria-describedby={'__issueType'} variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
            select type
          </Button>
          <Popover
            id={'__issueType'}
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
            series={CHART_DATA}
            options={chartOptions}
            height={364}
          />
          <ReactApexChart
            series={CHART_DATA}
            options={bottomChartOptions}
            height={200}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default IssueFrequency;
