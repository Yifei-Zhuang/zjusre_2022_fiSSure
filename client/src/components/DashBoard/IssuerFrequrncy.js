import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const IssuerFrequency = (data) => {
  var labels = [],
    number = [];
  for (var interval in data) {
    labels.push(interval);
    number.push(data[interval]);
  }
  const CHART_DATA = [
    {
      name: "commiter count",
      type: "area",
      data: number,
    },
  ];
  const chartOptions = merge(BaseOptionChart(), {
    chart: {
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

  return (
    <Card>
      <CardHeader title="issuerer change" />
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

export default IssuerFrequency;
