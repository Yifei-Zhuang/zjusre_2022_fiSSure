import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//

// ----------------------------------------------------------------------
// function msToTime(s) {
//     // Pad to 2 or 3 digits, default is 2
//     var pad = (n, z = 2) => ('00' + n).slice(-z);
//     return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 3);
// }
const IssueResponse = (data) => {

    var labels = [],
        myfastest = [],
        mypre25 = [],
        mymid = [],
        mypre75 = [],
        myslowest = [];
    const keyss = Object.keys(data).reverse()
    keyss.forEach(interval => {
        labels.push(interval);
        myfastest.push((data[interval].fastest / 3.6e6).toFixed(2));
        mypre25.push((data[interval].pre25 / 3.6e6).toFixed(2));
        mymid.push((data[interval].mid / 3.6e6).toFixed(2));
        mypre75.push((data[interval].pre75 / 3.6e6).toFixed(2));
        myslowest.push((data[interval].slowest / 3.6e6).toFixed(2));
    })
    var tem = []
    for (var i = 0; i < labels.length; i++) {
        tem[i] = {
            x: labels[i],
            y: [myfastest[i], mypre25[i], mymid[i], mypre75[i], myslowest[i]]
        }
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
            title: {
                text: "unit: hour(h)"
            },
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
