import { Component, OnInit } from '@angular/core';
import { FincasService } from '../../services/fincas.service';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fincas',
  templateUrl: './fincas.component.html',
  imports: [ CommonModule, FormsModule ],
  styleUrls: ['./fincas.component.scss']
})
export class FincasComponent implements OnInit {
  fincas: any[] = [];
  filtro: string = '';
  mostrarModal: boolean = false;

  // Añadimos estas propiedades
  nuevaFinca = {
    name: '',
    location: '',
    surface: '',
    oliveAmount: ''
  };

  mostrarFiltros: boolean = false;

  filtros = {
    location: '',
    kilosMin: null,
    kilosMax: null,
    surfaceMin: null,
    surfaceMax: null
  };


  // Para saber si estamos en modo de edición
  isEditMode: boolean = false;
  fincaSeleccionada: any = null;

  constructor(@Inject(FincasService) private fincasService: FincasService) {}

  ngOnInit() {
    this.obtenerFincas();
  }

  obtenerFincas() {
    this.fincasService.getUserFincas().subscribe(
      (data) => {
        this.fincas = data;
      },
      (error) => {
        console.error('Error al obtener fincas', error);
      }
    );
  }

  get fincasFiltradas() {
    return this.fincas.filter(finca => {
      const filtroNombre = this.filtro?.toLowerCase() ?? '';
      const nombreOk = finca.name.toLowerCase().includes(filtroNombre);
  
      const locationOk = !this.filtros.location || finca.location.toLowerCase().includes(this.filtros.location.toLowerCase());
  
      const kilosOk =
        (!this.filtros.kilosMin || finca.oliveAmount >= this.filtros.kilosMin) &&
        (!this.filtros.kilosMax || finca.oliveAmount <= this.filtros.kilosMax);
  
      const superficieOk =
        (!this.filtros.surfaceMin || finca.surface >= this.filtros.surfaceMin) &&
        (!this.filtros.surfaceMax || finca.surface <= this.filtros.surfaceMax);
  
      return nombreOk && locationOk && kilosOk && superficieOk;
    });
  }  

  // Función para abrir el modal
  abrirModal(finca?: any) {
    this.mostrarModal = true;
    if (finca) {
      this.isEditMode = true;
      this.fincaSeleccionada = finca;
      // Cargar los datos de la finca seleccionada en el formulario
      this.nuevaFinca = { ...finca };
    } else {
      this.isEditMode = false;
      // Resetear los campos si no es modo edición
      this.nuevaFinca = { name: '', location: '', surface: '', oliveAmount: '' };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.isEditMode = false;
    this.fincaSeleccionada = null;
  }

  get formInvalido() {
    return (
      !this.nuevaFinca.name.trim() ||
      !this.nuevaFinca.location.trim() ||
      !this.nuevaFinca.surface ||
      !this.nuevaFinca.oliveAmount
    );
  }

  guardarFinca() {
    if (this.formInvalido) {
      return;
    }

    if (this.isEditMode && this.fincaSeleccionada) {
      // Si estamos en modo edición, llamamos al servicio para actualizar la finca
      this.fincaSeleccionada.name = this.nuevaFinca.name;
      this.fincaSeleccionada.location = this.nuevaFinca.location;
      this.fincaSeleccionada.surface = this.nuevaFinca.surface;
      this.fincaSeleccionada.oliveAmount = this.nuevaFinca.oliveAmount;
      this.fincasService.actualizarFinca(this.fincaSeleccionada).subscribe(
        (data) => {
          console.log('Finca actualizada', data);
          this.obtenerFincas();
          this.cerrarModal();
        },
        (error) => {
          console.error('Error al actualizar finca', error);
        }
      );
    } else {
      // Si estamos en modo creación, llamamos al servicio para crear la finca
      this.fincasService.crearFinca(this.nuevaFinca).subscribe(
        (data) => {
          console.log('Finca creada', data);
          this.obtenerFincas();
          this.cerrarModal();
        },
        (error) => {
          console.error('Error al crear finca', error);
        }
      );
    }
  }
  
}
