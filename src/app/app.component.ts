import { Component, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import zoomPlugin from "chartjs-plugin-zoom";
import 'chartjs-adapter-date-fns';
Chart.register(zoomPlugin);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public lineChartData: ChartConfiguration["data"] = {
    datasets: [
      {
        label: 'RPM Motor',
        data: []
      }
    ]
  };

  public lineChartOptions: ChartConfiguration["options"] = {
    scales: {
      x: {
        type: 'time', // Set x-axis as time
        time: {
          unit: 'second', // Display time in seconds for real-time updates
          tooltipFormat: 'HH:mm:ss', // Format for tooltip on hover
        },
        title: {
          display: true,
          text: 'Time'
        }
        ,
      },
      y: {
        beginAtZero: true, // Start the y-axis from zero
        suggestedMin: 0,   // Minimum suggested value for auto-scaling
        suggestedMax: 120, // Maximum suggested value,
        title: {
          display: true,
          text: 'RPM'
        },
        ticks: {
          callback: function(value) {
            return value + ' RPM'; // Append the unit to the y-axis labels
          }
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          onPan: (event:any) => {
            const chart = event.chart as Chart;
            const currentXMin = chart.scales['x'].min;
            const currentXMax = chart.scales['x'].max;

            // Update only the x-axis limits for panning
            if (currentXMin < chart.scales['x'].min) {
              chart.scales['x'].min = chart.scales['x'].min; // Prevent panning beyond the minimum
            }

            if (currentXMax > chart.scales['x'].max) {
              chart.scales['x'].max = chart.scales['x'].max; // Prevent panning beyond the maximum
            }

            // Limit panning on the y-axis to prevent going below 0
            const currentYMin = chart.scales['y'].min;
            if (currentYMin < 0) {
              chart.scales['y'].min = 0; // Prevent panning beyond the minimum for y-axis
            }

            chart.update(); // Update the chart to reflect the changes
          },
        },
        zoom: {
          wheel: {
            enabled: true
          },
          mode: "x",
        }
      },
    }
  };

  public lineChartType: ChartType = "line";

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit() {
    setInterval(() => {
      const value = Math.round(Math.random() * 100);
      const data = this.lineChartData.datasets[0].data as { x: any, y: number }[];

      data.push({ x: new Date(), y: value });

      this.chart?.update();
    }, 2000);
  }
}
