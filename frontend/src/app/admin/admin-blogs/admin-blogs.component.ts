import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';
import {FormBuilder} from '@angular/forms';
import {DataTableDirective} from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Angular2Csv} from 'angular2-csv';

@Component({
  selector: 'app-admin-blogs',
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.css']
})
export class AdminBlogsComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public get_data_json: any[] = [];
  search_field: any = {
    'title':'',
    'description':''
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
        this.adminhttp.PostAPI('admin/get-blogs', dataTablesParameters).then((resdata: any) => {
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
        {data: 'id'},
        {data: 'blog_image'},
        {data: 'title'},
        {data: 'description'},
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

  change_status(id){
    var data = {id : id}
    this.adminhttp.PostAPI('admin/blog-change-status', data).then((resdata: any) => {
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
        this.adminhttp.PostAPI('admin/remove-blog', data).then((resdata: any) => {
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
    this.adminhttp.PostAPI('admin/export-blogs',data).then((resdata: any) => {
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
            'Title',
            'Description',
            'Date User ID Created',
            'Active/Inactive'
          ]
        };
        new Angular2Csv(resdata.response, 'Blogs-Export', options);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
