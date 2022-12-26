import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const CommiterFrequency = (data) => {
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
    {
      name: "commiter monthly count",
      type: "line",
      data: number.map((_, i) => { return i ? number[i] - number[i - 1] : 0 }),
    }
  ];
  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      id: 'chartCommiterFrequency',
      type: 'line',
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
        text: "commiter count",
        style: {
          color: '#008FFB',
        }
      },
      tooltip: {
        enabled: true
      }
    }, {
      seriesName: 'commiter monthly count',
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
        text: "commiter monthly count",
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
  const bottomChartOptions = merge(BaseOptionChart(), {
    chart: {
      id: "chartCommiterFrequency_",
      height: 130,
      type: "bar",
      foreColor: "#ccc",
      brush: {
        target: "chartCommiterFrequency",
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
      <CardHeader title="Commiter change" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          series={CHART_DATA}
          options={chartOptions}
          height={355}
        />
        <ReactApexChart
          series={CHART_DATA}
          options={bottomChartOptions}
          height={200}
        />
      </Box>
    </Card>
  );
};

export default CommiterFrequency;
