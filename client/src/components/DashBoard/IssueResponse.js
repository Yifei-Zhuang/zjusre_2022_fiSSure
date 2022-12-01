import { merge } from "lodash";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

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

var tem=[]
for(var i=0;i<mymid.length;i++)
{
  tem[i]=[new Date(labels[i]).getTime(),myfastest[i],mypre25[i],mymid[i],mypre75[i],myslowest[i]]
}

    const state = {
      series: [
        {
          type: 'boxPlot',
          xaxis: { type: "datetime" },
          data: tem
            
          
          }
      ],
      options: {
        chart: {
          type: 'boxPlot',
          height: 350
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            formatter: function(val) {
              return new Date(val).getFullYear()
            }
          }
        },
        plotOptions: {
          boxPlot: {
            colors: {
              upper: '#008FFB',
              lower: '#FEB019'
      
            }
          }
        }
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
