import { merge } from "lodash";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------
// data 是两个数据的data
const CompareCommitFrequency = (props) => {
  const { repoOwner, repoName, data1, anotherRepoOwner, anotherRepoName, data2 } = props;
  let labels1 = [],
    number1 = [];
  let labels2 = [], number2 = [];
  for (let interval in data1) {
    labels1.push(interval);
    number1.push(data1[interval]);
  }
  for (let interval in data2) {
    labels2.push(interval);
    number2.push(data2[interval]);
  }
  const CHART_DATA = [
    {
      name: `${repoOwner}/${repoName} commit times`,
      type: "line",
      data: number1,
    },
    {
      name: `${anotherRepoOwner}/${anotherRepoName} commit times`,
      type: "line",
      data: number2,
    }
  ];
  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      id: 'chartCommitFrequency',
      type: 'area',
      stacked: false,
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
    plotOptions: { bar: { columnWidth: "11%", borderRadius: 4 } },
    fill: { type: ["gradient", "solid"] },
    labels: labels1,
    xaxis: {
      categories: [
        ...labels1
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
        text: `${repoOwner}/${repoName} commit times`,
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
    }, {
      seriesName: `${anotherRepoOwner}/${anotherRepoName} commit times`,
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#00E396'
      },
      labels: {
        style: {
          colors: '#00E396',
        }
      },
      title: {
        text: `${anotherRepoOwner}/${anotherRepoName} commit times`,
        style: {
          color: '#00E396',
        }
      },
    },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
  });
  return (
    <Card>
      <CardHeader title="Commit frequency" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          series={CHART_DATA}
          options={chartOptions}
          height={355}
        />
      </Box>
    </Card>
  );
};

export default CompareCommitFrequency;
