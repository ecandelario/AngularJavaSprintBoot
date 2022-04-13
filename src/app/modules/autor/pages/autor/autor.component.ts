import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { errorResponse } from 'src/app/interfaces/response-interface';
import { TableColumn, TableColumnAction, TableDataSource } from 'src/app/interfaces/table-column';
import { TypeErrorInterface } from 'src/app/interfaces/type-error-interface';
import { ApiService } from 'src/app/services/api.service';
import { ShowTypedataService } from 'src/app/utility/services/show-typedata.service';
import { ValidationsService } from 'src/app/utility/services/validations.service';
import Swal from 'sweetalert2';
import { Autor, autorValidMessagesInterface } from '../../interface/autor';
import { AutorService } from '../../service/autor.service';
import { Error } from '../../../../interfaces/error';

@Component({
  selector: 'app-autor',
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.css']
})
export class AutorComponent implements OnInit {
  tableColumns: TableColumn[] = [];
  dataSource: TableDataSource = {} as TableDataSource;
  error: Error = {} as Error;
  entityForm!: FormGroup;
  autor_validation!: autorValidMessagesInterface;
  captionTable!: string;
  action!: string;

  @ViewChild('FormModal') formModal!: ElementRef<any>;

  constructor(
    private fb: FormBuilder,
    private autorApiSvc: ApiService,
    private erroSvc: ShowTypedataService,
    private validateSvc: ValidationsService,
    private autorSvc: AutorService
  ) {}

  ngOnInit(): void {
    this.captionTable = 'Autor';
    this.tableColumnsConfig();
    this.autoresGet();
    this.createform();
    this.autor_validation = this.autorSvc.autorValidationsMessages;
  }

  tableColumnsConfig() {
    this.tableColumns = [
      { title: 'Nombre', field: 'nombreCompleto' },
      { title: 'Fecha de nacimiento', field: 'fechaNacimiento' },
      { title: 'Ciudad', field: 'ciudadProcedencia' },
      { title: 'Email', field: 'email' },
    ];
  }

  createform(): void {
    this.entityForm = this.fb.group({
      id: [''],
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: [''],
      ciudadProcedencia: [''],
      email: [''],
    });
  }

  onAction(action: TableColumnAction) {
    this.action = action.action;
    this.action === 'New'
      ? this.clearField()
      : this.action === 'Delete'
      ? this.onConfirmation(action.data)
      : this.setEntity(action.data);
  }

  validateField(control: string, validation: TypeErrorInterface): boolean {
    return this.validateSvc.validateField(
      this.entityForm.controls[control],
      validation
    );
  }

  clearField() {
    this.entityForm.reset();
    this.entityForm.clearAsyncValidators();
    this.entityForm.clearValidators();
    this.error = {} as Error;
    this.disabled(false);
  }

  onSave(): void {
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }
    this.onConfirmation(this.entityForm.value);
  }

  onConfirmation(autor: Autor) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${this.captionTable} it!`,
    }).then(result => {
      if (result.isConfirmed) {
        if (this.action === 'New') {
          this.autorPost(autor);
        }
        if (this.action === 'Edit') {
          this.autorPut(autor);
        }
        if (this.action === 'Delete') {
          this.autorDelete(autor.id);
        }
      }
    });
  }

  setEntity(autor: Autor) {
    this.disabled(this.action === 'See');
    this.entityForm.patchValue({
      id: autor.id,
      nombreCompleto: autor.nombreCompleto,
      fechaNacimiento: new Date(this.formatDate(autor.fechaNacimiento))
        .toISOString()
        .substring(0, 10),
      ciudadProcedencia: autor.ciudadProcedencia,
      email:autor.email
    });
  }

  private formatDate(date: any) {
    let newDate = new Date(date);
    return newDate.toJSON().split('T')[0];
  }

  disabled(value: boolean) {
    if (value) {
      this.entityForm.controls['nombreCompleto'].disable();
      this.entityForm.controls['fechaNacimiento'].disable();
      this.entityForm.controls['ciudadProcedencia'].disable();
      this.entityForm.controls['email'].disable();
    } else {
      this.entityForm.controls['nombreCompleto'].enable();
      this.entityForm.controls['fechaNacimiento'].enable();
      this.entityForm.controls['ciudadProcedencia'].enable();
      this.entityForm.controls['email'].enable();
    }
  }

  autoresGet(pageNumber: number = 0): void {
    this.autorApiSvc
      .get<Autor[]>('autor/autores')
      .subscribe(
        (response: Autor[]) => {
          console.log(response);
          this.dataSource.dataset = response;
        },
        (error: errorResponse) => {
          console.log(error);
          this.error = this.erroSvc.showerror(
            true,
            error.errors,
            error.status,
            error.message
          );
        }
      );
  }

  autorPost(autor: Autor): void {
    this.autorApiSvc
      .post<Autor>('autor', 'autor', autor)
      .subscribe(
        (response: Autor) => {
            this.autoresGet();
            Swal.fire('Transacción exitosa', response.nombreCompleto, 'success');
            this.onCloseForm();
        },
        (error: errorResponse) => {
          Swal.fire('Transacción no exitosa', error.message, 'error');
          this.error = this.erroSvc.showerror(
            true,
            error.errors,
            error.status,
            error.message
          );
        }
      );
  }

  autorPut(autor: Autor): void {
    this.autorApiSvc
      .put<Autor>('autor', 'autor', autor.id, autor)
      .subscribe(
        (response: Autor) => {
            this.autoresGet();
            Swal.fire('Actualización exitosa', response.nombreCompleto, 'success');
            this.onCloseForm();
        },
        (error: errorResponse) => {
          Swal.fire('Transacción no exitosa', error.message, 'error');
          this.error = this.erroSvc.showerror(
            true,
            error.errors,
            error.status,
            error.message
          );
        }
      );
  }

  autorDelete(id: number): void {
    this.autorApiSvc
      .delete<any>('autor', 'autor', id)
      .subscribe(
        (response: any) => {
            this.autoresGet();
            Swal.fire('Eliminación exitosa', '', 'success');
        },
        (error: errorResponse) => {
          Swal.fire(
            'Transacción no exitosa',
            `${error.message}`,
            'error'
          );
          this.error = this.erroSvc.showerror(
            true,
            error.errors,
            error.status,
            error.message
          );
        }
      );
  }

  onCloseForm() {
    this.clearField();
    this.formModal.nativeElement.click();
  }

}
