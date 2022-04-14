import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { errorResponse } from 'src/app/interfaces/response-interface';
import { TableColumn, TableColumnAction, TableDataSource } from 'src/app/interfaces/table-column';
import { TypeErrorInterface } from 'src/app/interfaces/type-error-interface';
import { ApiService } from 'src/app/services/api.service';
import { ShowTypedataService } from 'src/app/utility/services/show-typedata.service';
import { ValidationsService } from 'src/app/utility/services/validations.service';
import Swal from 'sweetalert2';
import { Error } from '../../../../interfaces/error';
import { Editorial, editorialValidMessagesInterface } from '../../interface/editorial';
import { EditorialService } from '../../service/editorial.service';

@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.css']
})
export class EditorialComponent implements OnInit {
  tableColumns: TableColumn[] = [];
  dataSource: TableDataSource = {} as TableDataSource;
  error: Error = {} as Error;
  entityForm!: FormGroup;
  editorial_validation!: editorialValidMessagesInterface;
  captionTable!: string;
  action!: string;

  @ViewChild('FormModal') formModal!: ElementRef<any>;

  constructor(
    private fb: FormBuilder,
    private editorialApiSvc: ApiService,
    private erroSvc: ShowTypedataService,
    private validateSvc: ValidationsService,
    private editorialSvc: EditorialService
  ) {}

  ngOnInit(): void {
    this.captionTable = 'editorial';
    this.tableColumnsConfig();
    this.editorialesGet();
    this.createform();
    this.editorial_validation = this.editorialSvc.editorialValidationsMessages;
  }

  tableColumnsConfig() {
    this.tableColumns = [
      { title: 'Nombre', field: 'nombre' },
      { title: 'Dirección', field: 'direccion' },
      { title: 'Teléfono', field: 'telefono' },
      { title: 'Email', field: 'email' },
      { title: 'Maximo libro', field: 'maximoLibros' },
    ];
  }

  createform(): void {
    this.entityForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.minLength(3)]],
      email: [''],
      maximoLibros:['', [Validators.required, Validators.minLength(3)]]
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

  onConfirmation(editorial: Editorial) {
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
          this.editorialPost(editorial);
        }
        if (this.action === 'Edit') {
          this.editorialPut(editorial);
        }
        if (this.action === 'Delete') {
          this.editorialDelete(editorial.id);
        }
      }
    });
  }

  setEntity(editorial: Editorial) {
    this.disabled(this.action === 'See');
    this.entityForm.patchValue({
      id: editorial.id,
      nombre: editorial.nombre,
      direccion: editorial.direccion,
      telefono: editorial.telefono,
      email: editorial.email,
      maximoLibros: editorial.maximoLibros
    });
  }

  private formatDate(date: any) {
    let newDate = new Date(date);
    return newDate.toJSON().split('T')[0];
  }

  disabled(value: boolean) {
    if (value) {
      this.entityForm.controls['nombre'].disable();
      this.entityForm.controls['direccion'].disable();
      this.entityForm.controls['telefono'].disable();
      this.entityForm.controls['email'].disable();
      this.entityForm.controls['maximoLibros'].disable();
    } else {
      this.entityForm.controls['nombre'].enable();
      this.entityForm.controls['direccion'].enable();
      this.entityForm.controls['telefono'].enable();
      this.entityForm.controls['email'].enable();
      this.entityForm.controls['maximoLibros'].enable();
    }
  }

  editorialesGet(pageNumber: number = 0): void {
    this.editorialApiSvc
      .get<Editorial[]>('editorial/editoriales')
      .subscribe(
        (response: Editorial[]) => {
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

  editorialPost(editorial: Editorial): void {
    this.editorialApiSvc
      .post<Editorial>('editorial', 'editorial', editorial)
      .subscribe(
        (response: Editorial) => {
            this.editorialesGet();
            Swal.fire('Transacción exitosa', response.nombre, 'success');
            this.onCloseForm();
        },
        (error: HttpErrorResponse ) => {
          Swal.fire('Transacción no exitosa', error.error.message, 'error');
          this.error = this.erroSvc.showerror(
            false,
            error.error.errors,
            error.error.status,
            error.error.message
          );
        }
      );
  }

  editorialPut(editorial: Editorial): void {
    this.editorialApiSvc
      .put<Editorial>('editorial', 'editorial', editorial.id, editorial)
      .subscribe(
        (response: Editorial) => {
            this.editorialesGet();
            Swal.fire('Actualización exitosa', response.nombre, 'success');
            this.onCloseForm();
        },
        (error: HttpErrorResponse ) => {
          Swal.fire('Transacción no exitosa', error.error.message, 'error');
          this.error = this.erroSvc.showerror(
            false,
            error.error.errors,
            error.error.status,
            error.error.message
          );
        }
      );
  }

  editorialDelete(id: number): void {
    this.editorialApiSvc
      .delete<any>('editorial', 'editorial', id)
      .subscribe(
        (response: any) => {
            this.editorialesGet();
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
