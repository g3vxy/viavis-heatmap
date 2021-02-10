import React from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';

const getPointCategoryName = (point, dimension) => {
    let series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
}

const options = {
    chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },

    title: {
        text: 'Sales per employee per weekday'
    },

    xAxis: {
        categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
    },

    yAxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Total', 'Average'],
        title: null,
        reversed: true
    },

    accessibility: {
        point: {
            descriptionFormatter: function (point) {
                var ix = point.index + 1,
                    xName = getPointCategoryName(point, 'x'),
                    yName = getPointCategoryName(point, 'y'),
                    val = point.value;
                return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
            }
        }
    },

    colorAxis: {
        min: 0,
        max: 150,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    },

    legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
        formatter: function () {
            return '<b>' + getPointCategoryName(this.point, 'x') + '</b> sold <br><b>' +
                this.point.value + '</b> items on <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
        }
    },

    series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                yAxis: {
                    labels: {
                        formatter: function () {
                            return this.value.charAt(0);
                        }
                    }
                }
            }
        }]
    }
}

const CustomHeatMap = props => {
    /* 
    - data: comes from parent component and it contains 
    values for map.
    - row_count: comes from parent component, i created this
    variable because i wanted be able to add more rows if i want.
    */
    let data = [...props.data]
    const row_count = props.row_count
    let totals = [], averages = []

    // i'm dividing the data array because
    // it's easier the access data in this way
    // because it actually becomes a 3d array
    let data_chunks = []
    while (data.length > 0) {
        data_chunks.push(data.splice(0, row_count))
    }

    // calculating totals and averages

    data_chunks.forEach(column => {
        let total = 0
        column.forEach(element => {
            total += element[2] // i didnt wanna use
        });                    // "magic numbers"
        totals.push(total)     // but i had to.
    });


    totals.forEach(element => {
        averages.push(element / row_count)
    });

    /*
      creating the final array and pushing values from
      totals and averages to this array.
    */
    let concatenated_data = [...props.data]

    for (let column = 0; column < 10; column++) {
        concatenated_data.push({
            x: column, y: row_count,
            color: '#ffffff', value: totals[column]
        })
    }
    for (let column = 0; column < 10; column++) {
        concatenated_data.push({
            x: column, y: row_count + 1,
            color: '#ffffff', value: averages[column]
        })
    }

    options.series[0].data = concatenated_data

    return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>

}

export default CustomHeatMap