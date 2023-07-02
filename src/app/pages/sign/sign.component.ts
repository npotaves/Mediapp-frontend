import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SignService } from 'src/app/service/sign.service';
import { Sign } from 'src/app/model/sign';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {

  displayedColumns: string[] = ['id', 'patient', 'temperature', 'pulse', 'respiratoryRate', 'signDate', 'actions'];
  dataSource: MatTableDataSource<Sign>;
  dataSourceFiltered: MatTableDataSource<Sign>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalElements: number = 0;
  filter: "";

  constructor(
    private signService: SignService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {

    this.signService.getSignChange().subscribe(data => {
      this.createTable(data);
      this.dataSource.filterPredicate = (data: Sign, filter: string) => !filter || data.patient.firstName.toLocaleLowerCase().includes(filter) || data.patient.lastName.toLocaleLowerCase().includes(filter) || data.temperature.toLowerCase().includes(filter)
        || data.pulse.toLowerCase().includes(filter) || data.respiratoryRate.toLowerCase().includes(filter);

    });

    this.signService.getMessageChange().subscribe(data => {
      this._snackBar.open('INFO', data, { duration: 2000, verticalPosition: 'top', horizontalPosition: 'right' });
    });

    this.signService.findAll().subscribe({
      next: (data: Sign[]) => {
        this.createTable(data);
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
      complete: () => {
        this.dataSource.filterPredicate = (data: Sign, filter: string) =>
          !filter ||
          data.patient.firstName.toLowerCase().includes(filter) ||
          data.patient.lastName.toLowerCase().includes(filter) ||
          data.temperature.toLowerCase().includes(filter) ||
          data.pulse.toLowerCase().includes(filter) ||
          data.respiratoryRate.toLowerCase().includes(filter);
      }
    });
  }

  customFilterPredicate(data: Sign, filter: string) {
    return data.patient.firstName.toLocaleLowerCase().includes(filter);
  }

  delete(idSign: number) {
    if (confirm("Are you sure to delete the sign?")) {
      this.signService.delete(idSign).pipe(switchMap(() => {
        return this.signService.findAll();
      })).subscribe(data => {
        this.signService.setSignChange(data);
        this.signService.setMessageChange('DELETED!');
      });
    }
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  createTable(data: Sign[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
  }

}
