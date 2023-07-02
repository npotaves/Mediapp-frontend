import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, map, tap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { Sign } from 'src/app/model/sign';
import { PatientService } from 'src/app/service/patient.service';
import { SignService } from 'src/app/service/sign.service';
import { PatientDialogComponent } from '../patient-dialog/patient-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-sign-edit',
  templateUrl: './sign-edit.component.html',
  styleUrls: ['./sign-edit.component.css']
})
export class SignEditComponent implements OnInit {

  form: FormGroup;
  id: number;
  isEdit: boolean;
  patients: Patient[];
  minDate: Date = new Date();

  patientsFiltered$: Observable<Patient[]>;
  patientControl: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signService: SignService,
    private patientService: PatientService,
    private _dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {

    this.signService.getPatientChange().subscribe(data => {
      this.patients = data;
    });

    this.signService.getPatientControlChange().subscribe(data => {
      this.patientControl.setValue(data);
    });

    this.form = new FormGroup({
      idSign: new FormControl(0),
      patient: this.patientControl,
      temperature: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      pulse: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      respiratoryRate: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      signDate: new FormControl(new Date(), [Validators.required]),
    });

    this.loadInitialData();

    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));


    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  filterPatients(val: any) {
    if (val?.idPatient > 0) {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase())
      )
    } else {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase())
      );
    }
  }
  loadInitialData() {
    this.patientService.findAll().subscribe(data => this.patients = data);

  }
  openDialog(patient?: Patient) {
    this._dialog.open(PatientDialogComponent, {
      width: '400px',
      data: patient
    });
  }

  initForm() {
    if (this.isEdit) {
      this.signService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          idSign: new FormControl(data.idSign),
          patient: this.patientControl,
          temperature: new FormControl(data.temperature, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          pulse: new FormControl(data.pulse, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          respiratoryRate: new FormControl(data.respiratoryRate, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
          signDate: new FormControl(data.signDate, Validators.required)
        });
        this.patientControl.setValue(data.patient);
        this.minDate = null;
      });
    }
  }
  showPatient(val: any) {
    return val ? `${val.firstName} ${val.lastName}` : val;
  }
  operate() {
    if (this.form.invalid) {
      return;
    }

    const sign = new Sign();
    sign.idSign = this.form.value['idSign'];
    sign.patient = this.form.value['patient'];
    sign.temperature = this.form.value['temperature'];
    sign.pulse = this.form.value['pulse'];
    sign.respiratoryRate = this.form.value['respiratoryRate'];
    sign.signDate = this.form.value['signDate'];

    if (this.isEdit) {
      //UPDATE
      this.signService.update(this.id, sign)
        .pipe(
          switchMap(() => this.signService.findAll())
        )
        .subscribe((data: Sign[]) => {
          this.signService.setSignChange(data);
          this.signService.setMessageChange('UPDATED!');
        });

    } else {
      //INSERT
      this.signService.save(sign).pipe(switchMap(() => {
        return this.signService.findAll();
      }))
        .subscribe(data => {
          this.signService.setSignChange(data);
          this.signService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['/pages/sign']);
  }

  get f() {
    return this.form.controls;
  }
}

