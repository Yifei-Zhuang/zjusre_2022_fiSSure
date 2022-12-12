import { merge } from "lodash";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------
function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  var pad = (n, z = 2) => ('00' + n).slice(-z);
  return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 3);
}
const IssueResponse = (data) => {

  var labels = [],
    myfastest = [],
    mypre25 = [],
    mymid = [],
    mypre75 = [],
    myslowest = [];
  for (var interval in data) {
    labels.push(interval);
    myfastest.push(data[interval].fastest);
    mypre25.push(data[interval].pre25);
    mymid.push(data[interval].mid);
    mypre75.push(data[interval].pre75);
    myslowest.push(data[interval].slowest);

  }

  var tem = []
  for (var i = 0; i < mymid.length; i++) {
    tem[i] = [new Date(labels[i]).getTime(), myfastest[i], mypre25[i], mymid[i], mypre75[i], myslowest[i]]
  }
  const state = {
    series: [
      {
        xaxis: {
          categories: [
            ...labels
          ]
        },
        data: tem
      }
    ],

    options: {
      chart: {
        type: 'boxPlot',
        height: 350,
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
      xlabels: labels,
      xaxis: {
        categories: [
          ...labels
        ]
      },
      yaxis: {
        show: false,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: '#008FFB',
            lower: '#FEB019'

          }
        }
      },
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
    },

  };
  return (
    <Card>
      <CardHeader title="Issue Response" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          options={state.options} series={state.series} type="boxPlot" height={350}
        />
      </Box>
    </Card>
  );
};

export default IssueResponse;
