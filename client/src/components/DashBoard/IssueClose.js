import { merge } from "lodash";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

const IssueClose = (data) => {
  var labels = [],
    month_open = [],
    month_closed = [],
    total_open = [],
    total_closed = [];
  for (var interval in data) {
    labels.push(interval);
    month_open.push(data[interval]['month-opened']);
    month_closed.push(data[interval]['month-closed']);
    total_open.push(data[interval]['total-opened']);
    total_closed.push(data[interval]['total-closed']);
  }
  const state = {
    series: [{
      name: 'total-opened',
      type: 'area',
      data: total_open
    }, {
      name: 'month-opened',
      type: 'line',
      data: month_open
    },
    {
      name: 'month-closed',
      type: 'line',
      data: month_closed
    },
    {
      name: 'total-closed',
      type: 'area',
      data: total_closed
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 1],
      },
      labels: labels,
      markers: {
        size: 0
      },
      yaxis: [
        {
          title: {
            text: 'Series A',
          },
        },
        {
          opposite: true,
          title: {
            text: 'Series B',
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          }
        }
      }
    },


  };
  return (
    <Card>
      <CardHeader title="Issue Monthly State" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          options={state.options} series={state.series} type="line" height={350}

        />
      </Box>
    </Card>
  );
};

export default IssueClose;
