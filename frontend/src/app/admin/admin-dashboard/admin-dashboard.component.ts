import { Component, OnInit, ViewChild } from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';
import {Location} from '@angular/common';
// @ts-ignore
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  total_users = ''
  total_trainers = ''
  total_gym = ''
  users = []
  trainers = []

  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location,private route: ActivatedRoute) {
    this.chartOptions = {
      series: [
        {
          name: "Users",
          data: this.users
        },
        {
          name: "Trainers",
          data: this.trainers
        }
      ],
      chart: {
        height: 500,
        type: "bar",
        zoom: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        curve: "smooth",
        width: 2,
        dashArray: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      },
      yaxis: {
        title: {
          text: "Recent",
          offsetX: 0,
          offsetY: 0,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000",
          },
        }
      },
      fill: {
        opacity: 1
      }
    };
  }

  ngOnInit(): void {
    this.get_data()
  }

  get_data(){
    var data = {};
    this.adminhttp.PostAPI('admin/get-dashboard', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.total_users = resdata.data.total_users;
        this.total_trainers = resdata.data.total_trainers;
        this.total_gym = resdata.data.total_gym;
        this.users = resdata.data.users;
        this.trainers = resdata.data.trainers;
        this.chartOptions = {
          series: [
            {
              name: "Users",
              data: this.users
            },
            {
              name: "Trainers",
              data: this.trainers
            }
          ],
          chart: {
            height: 500,
            type: "bar",
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
              endingShape: "rounded"
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            curve: "smooth",
            width: 2,
            dashArray: 0,
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
          },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ]
          },
          yaxis: {
            title: {
              text: "Recent",
              offsetX: 0,
              offsetY: 0,
              style: {
                fontSize: "14px",
                fontWeight: "bold",
                color: "#000",
              },
            }
          },
          fill: {
            opacity: 1
          }
        };
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
