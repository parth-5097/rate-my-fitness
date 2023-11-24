import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';
import {FormBuilder} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Angular2Csv} from 'angular2-csv';

@Component({
  selector: 'app-admin-trainers',
  templateUrl: './admin-trainers.component.html',
  styleUrls: ['./admin-trainers.component.css']
})
export class AdminTrainersComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public get_data_json: any[] = [];
  search_field: any = {
    'first_name':'',
    'gym_name':'',
    'email':'',
    'rating':'',
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
        this.adminhttp.PostAPI('admin/get-trainers', dataTablesParameters).then((resdata: any) => {
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
        {data: 'tr.trainer_id'},
        {data: 'avatar'},
        {data: 'first_name'},
        {data: 'gym_id'},
        {data: 'email'},
        {data: 'rating'},
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

  change_status(trainer_id){
    var data = {trainer_id : trainer_id}
    this.adminhttp.PostAPI('admin/trainer-change-status', data).then((resdata: any) => {
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
        this.adminhttp.PostAPI('admin/remove-trainer', data).then((resdata: any) => {
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
    this.adminhttp.PostAPI('admin/export-trainers',data).then((resdata: any) => {
      if (resdata.status == 200){
        var options = {
          title: 'Trainers Sheet',
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true,
          showTitle: false,
          useBom: true,
          headers: [
            'ID',
            'Gym Name',
            'First Name',
            'Last Name',
            'Email',
            'Phone',
            'Rating',
            'Date User ID Created',
            'Active/Inactive'
          ]
        };
        new Angular2Csv(resdata.response, 'Trainers-Export', options);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
