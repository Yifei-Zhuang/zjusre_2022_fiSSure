import { merge } from "lodash";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const CommitFrequency = (data) => {
  var labels = [],
    number = [];
  for (var interval in data) {
    labels.push(interval);
    number.push(data[interval]);
  }
  const CHART_DATA = [
    {
      name: "commit times",
      type: "area",
      data: number,
    },
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
    labels: labels,
    xaxis: {
      categories: [
        ...labels
      ]
    },
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
  const bottomChartOptions = merge(BaseOptionChart(), {
    chart: {
      id: "chartCommitFrequency_",
      height: 130,
      type: "bar",
      foreColor: "#ccc",
      brush: {
        target: "chartCommitFrequency",
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
    <Card>
      <CardHeader title="Commit frequency" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          series={CHART_DATA}
          options={chartOptions}
          height={355}
        />
        <ReactApexChart
          series={CHART_DATA}
          options={bottomChartOptions}
          height={150}
        />
      </Box>
    </Card>
  );
};

export default CommitFrequency;
