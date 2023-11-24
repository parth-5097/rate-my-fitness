import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';
import { DataTableDirective } from 'angular-datatables';
import {FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// @ts-ignore
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-admin-gym',
  templateUrl: './admin-gym.component.html',
  styleUrls: ['./admin-gym.component.css']
})
export class AdminGymComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public get_data_json: any[] = [];
  search_field: any = {
    'gym_name':'',
    'description':'',
    'street_address':'',
    'phone':''
  };
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dataTableInit()
  }

  dataTableInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      responsive: true,
      searching: false,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters['search_text'] = this.search_field;
        this.adminhttp.PostAPI('admin/get-gym', dataTablesParameters).then((resdata: any) => {
          if (resdata.status == 200) {
            this.get_data_json = resdata.response;
          } else {
            this.get_data_json = [];
          }
          callback({
            recordsTotal: resdata.TotalRecords,
            recordsFiltered: resdata.TotalRecords,
            data: []
          })
        }).catch((err) => {
          this.get_data_json = [];
          callback({
            recordsTotal: 0,
            recordsFiltered: 0,
            data: []
          })
        })
      },
      columns: [
        {data: 'gym_id'},
        {data: 'gym_avatar'},
        {data: 'gym_name'},
        {data: 'description'},
        {data: 'street_address'},
        {data: 'phone'},
        {data: 'status',orderable:false,searchable:false},
        {data: 'action',orderable:false,searchable:false}
      ],
    };
  }

  timer: any = "";

  filterById() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.ReloadDatatable()
    }, 500)
  }

  ReloadDatatable() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  change_status(gym_id){
    var data = {gym_id : gym_id}
    this.adminhttp.PostAPI('admin/gym-change-status', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  delete_user(data){
    Swal.fire({
      title: "",
      text: "",
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.value) {
        this.adminhttp.PostAPI('admin/remove-gym', data).then((resdata: any) => {
          if (resdata.status == 200) {
            this.toastr.success(resdata.message);
            this.ReloadDatatable()
          }else {
            this.toastr.error(resdata.message)
          }
        }).catch((err) => {
          return err;
        });
      } else {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
      return result;
    });
  }

  export_csv(){
    var data = {};
    this.adminhttp.PostAPI('admin/export-gym',data).then((resdata: any) => {
      if (resdata.status == 200){
        var options = {
          title: 'Gym Sheet',
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: false,
          useBom: true,
          headers: [
            'ID',
            'Gym Name',
            'Description',
            'Phone',
            'Suite Number',
            'Street Address',
            'City',
            'State',
            'Zipcode',
            'Date Gym ID Created',
            'Active/Inactive'
          ]
        };
        new Angular2Csv(resdata.response, 'GYM-Export', options);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
