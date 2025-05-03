import { Component, OnInit } from '@angular/core';
import { FincasService } from '../../services/fincas.service';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cosecha {
  year: number;
  olivesHarvestedKg: string;
  oilYieldPercent: string;
}

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

  currentYear: number = new Date().getFullYear();

  nuevaFinca = {
    name: '',
    location: '',
    surface: '',
    oliveAmount: '',
    harvests: [] as Cosecha[]
  };

  cosechaTemporal = {
    year: this.currentYear,
    olivesHarvestedKg: '',
    oilYieldPercent: ''
  };

  mostrarFormularioCosecha = false;

  mostrarFiltros: boolean = false;

  filtros = {
    location: '',
    kilosMin: null,
    kilosMax: null,
    surfaceMin: null,
    surfaceMax: null
  };

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

  abrirModal(finca?: any) {
    this.mostrarModal = true;
    this.mostrarFormularioCosecha = false;
    if (finca) {
      this.isEditMode = true;
      this.fincaSeleccionada = finca;
      this.nuevaFinca = { ...finca };
    } else {
      this.isEditMode = false;
      this.nuevaFinca = {
        name: '',
        location: '',
        surface: '',
        oliveAmount: '',
        harvests: []
      };
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.isEditMode = false;
    this.fincaSeleccionada = null;
  }

  get formInvalido() {
    const { name, location, surface, oliveAmount } = this.nuevaFinca;
  
    return (
      !name || name.trim() === '' ||
      !location || location.trim() === '' ||
      surface === null || surface === '' || isNaN(Number(surface)) ||
      oliveAmount === null || oliveAmount === '' || isNaN(Number(oliveAmount))
    );
  }  

  guardarFinca() {
    if (this.formInvalido) {
      return;
    }

    if (this.isEditMode && this.fincaSeleccionada) {
      this.fincaSeleccionada.name = this.nuevaFinca.name;
      this.fincaSeleccionada.location = this.nuevaFinca.location;
      this.fincaSeleccionada.surface = this.nuevaFinca.surface;
      this.fincaSeleccionada.oliveAmount = this.nuevaFinca.oliveAmount;
      this.fincaSeleccionada.harvests = this.nuevaFinca.harvests;
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

  agregarCosecha() {
    const { year, olivesHarvestedKg, oilYieldPercent } = this.cosechaTemporal;
    if (year && olivesHarvestedKg && oilYieldPercent) {
      this.nuevaFinca.harvests.push({
        year,
        olivesHarvestedKg,
        oilYieldPercent
      });

      this.cosechaTemporal = {
        year: this.currentYear,
        olivesHarvestedKg: '',
        oilYieldPercent: ''
      };
      this.mostrarFormularioCosecha = false;
    }
  }

  cancelarCosecha() {
    this.cosechaTemporal = {
      year: this.currentYear,
      olivesHarvestedKg: '',
      oilYieldPercent: ''
    };
    this.mostrarFormularioCosecha = false;
  }

  eliminarCosecha(index: number) {
    this.nuevaFinca.harvests.splice(index, 1);
  }
}
