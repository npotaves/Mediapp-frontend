import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  map, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { SignService } from 'src/app/service/sign.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css']
})
export class PatientDialogComponent implements OnInit {
  patient: Patient;
  idPatient: number;
  patientSel: Patient;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Patient,
    private _dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService,
    private signService: SignService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      dni: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      address: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  operate() {
    //INSERT
    if (this.form.valid) {
      const patient = new Patient();
      patient.firstName = this.form.value['firstName'];
      patient.lastName = this.form.value['lastName'];
      patient.dni = this.form.value['dni'];
      patient.address = this.form.value['address'];
      patient.phone = this.form.value['phone'];
      patient.email = this.form.value['email'];

      this.patientService.saveReturn(patient)
        .pipe(map((data: Patient) => {
          this.idPatient = data.idPatient;
          this.patientSel = data;
        })).pipe(switchMap(() => this.patientService.findAll()))
        .subscribe(data => {
          this.signService.setPatientChange(data);
          this.signService.setPatientControlChange(this.patientSel);
          this.signService.setMessageChange('PATIENT CREATED!')
        });
      this.close();
    }
  }

  close() {
    this._dialogRef.close();
  }
  get f() {
    return this.form.controls;
  }
}

