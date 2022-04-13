import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Error } from 'src/app/interfaces/error';
import { errorResponse } from 'src/app/interfaces/response-interface';
import { TableColumn, TableColumnAction, TableDataSource } from 'src/app/interfaces/table-column';
import { TypeErrorInterface } from 'src/app/interfaces/type-error-interface';
import { ApiService } from 'src/app/services/api.service';
import { ShowTypedataService } from 'src/app/utility/services/show-typedata.service';
import { ValidationsService } from 'src/app/utility/services/validations.service';
import Swal from 'sweetalert2';
import { Libro, libroValidMessagesInterface } from '../../interface/libro';
import { LibroService } from '../../service/libro.service';

@Component({
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit {
  tableColumns: TableColumn[] = [];
  dataSource: TableDataSource = {} as TableDataSource;
  error: Error = {} as Error;
  entityForm!: FormGroup;
  search = new FormControl('')
  libro_validation!: libroValidMessagesInterface;
  captionTable!: string;
  action!: string;

  @ViewChild('FormModal') formModal!: ElementRef<any>;

  constructor(
    private fb: FormBuilder,
    private libroApiSvc: ApiService,
    private erroSvc: ShowTypedataService,
    private validateSvc: ValidationsService,
    private libroSvc: LibroService
  ) {}

  ngOnInit(): void {
    this.captionTable = 'Libro';
    this.tableColumnsConfig();
    this.librosGet();
    this.createform();
    this.libro_validation = this.libroSvc.libroValidationsMessages;
  }

  tableColumnsConfig() {
    this.tableColumns = [
      { title: 'Título', field: 'titulo' },
      { title: 'Año', field: 'anios' },
      { title: 'Género', field: 'genero' },
      { title: 'Número de página', field: 'numeroPaginas' },
      { title: 'Editorial', field: 'editorial' },
      { title: 'Autor', field: 'autor' },
    ];
  }

  createform(): void {
    this.entityForm = this.fb.group({
      id: [''],
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      anios: [''],
      genero: ['', [Validators.required, Validators.minLength(3)]],
      numeroPaginas: ['', [Validators.required, Validators.minLength(3)]],
      editorial: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', [Validators.required, Validators.minLength(3)]],
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

  onConfirmation(libro: Libro) {
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
          this.libroPost(libro);
        }
        if (this.action === 'Edit') {
          this.libroPut(libro);
        }
        if (this.action === 'Delete') {
          this.libroDelete(libro.id);
        }
      }
    });
  }

  setEntity(libro: Libro) {
    this.disabled(this.action === 'See');
    this.entityForm.patchValue({
      id: libro.id,
      titulo: libro.titulo,
      anios: libro.anios,
      genero: libro.genero,
      numeroPaginas: libro.numeroPaginas,
      editorial:libro.editorial,
      autor: libro.autor
    });
  }

  private formatDate(date: any) {
    let newDate = new Date(date);
    return newDate.toJSON().split('T')[0];
  }

  disabled(value: boolean) {
    if (value) {
      this.entityForm.controls['titulo'].disable();
      this.entityForm.controls['anios'].disable();
      this.entityForm.controls['genero'].disable();
      this.entityForm.controls['numeroPaginas'].disable();
      this.entityForm.controls['editorial'].disable();
      this.entityForm.controls['autor'].disable();
    } else {
      this.entityForm.controls['titulo'].enable();
      this.entityForm.controls['anios'].enable();
      this.entityForm.controls['genero'].enable();
      this.entityForm.controls['numeroPaginas'].enable();
      this.entityForm.controls['editorial'].enable();
      this.entityForm.controls['autor'].enable();
    }
  }

  librosGet(pageNumber: number = 0): void {
    this.libroApiSvc
      .getSearch<Libro[]>('libro/libros', this.search.value)
      .subscribe(
        (response: Libro[]) => {
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

  libroPost(libro: Libro): void {
    this.libroApiSvc
      .post<Libro>('libro', 'libro', libro)
      .subscribe(
        (response: Libro) => {
            this.librosGet();
            Swal.fire('Transacción exitosa', response.titulo, 'success');
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

  libroPut(libro: Libro): void {
    this.libroApiSvc
      .put<Libro>('libro', 'libro', libro.id, libro)
      .subscribe(
        (response: Libro) => {
            this.librosGet();
            Swal.fire('Actualización exitosa', response.titulo, 'success');
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

  libroDelete(id: number): void {
    this.libroApiSvc
      .delete<any>('libro', 'libro', id)
      .subscribe(
        (response: any) => {
            this.librosGet();
            Swal.fire('Eliminación exitosa','' , 'success');
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
