import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { FincasService } from '../../services/fincas.service';
import { Inject } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

interface Cosecha {
  year: number;
  olivesHarvestedKg: number;
  oilYieldPercent: number;
}

interface Finca {
  harvests?: Cosecha[];
  surface?: number;
  oliveAmount?: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, NgChartsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  fincas: Finca[] = [];
  totalOlives = 0;
  averageOlives = 0;
  totalOil = 0;
  totalOilInLiters = 0;
  averageYield = 0;
  productionPerHectare = 0;
  totalProcessedOlives = 0;

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  gradeChartData: ChartData<'line'> = { labels: [], datasets: [] };
  scatterChartData: ChartData<'scatter'> = { datasets: [] };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: {}, y: { beginAtZero: true } }
  };

  gradeChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: { x: {}, y: { beginAtZero: true } }
  };

  scatterChartOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { type: 'linear', position: 'bottom' },
      y: { beginAtZero: true }
    }
  };

  selectedYear: number | 'all' = 'all';
  availableYears: number[] = [];
  title: string = "Estadísticas de producción";

  constructor(@Inject(FincasService) private fincasService: FincasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fincasService.getUserFincas().subscribe((fincas) => {
      this.fincas = fincas;
      this.availableYears = this.obtenerAniosDisponibles();
      this.calcularEstadisticas();
      this.generarGrafica();
      this.generarGraficaGrados();
      this.generarGraficaCompleja();
    });
  }

  obtenerAniosDisponibles(): number[] {
    const years = new Set<number>();
    for (const finca of this.fincas) {
      for (const h of finca.harvests || []) {
        years.add(h.year);
      }
    }
    return Array.from(years).sort();
  }

  filtrarHarvests() {
    return this.selectedYear === 'all'
      ? this.fincas.flatMap(f => f.harvests || [])
      : this.fincas.flatMap(f => (f.harvests || []).filter(h => h.year === this.selectedYear));
  }

  calcularEstadisticas(): void {
    let totalOlives = 0;
    let totalOilKg = 0;
    let totalOilLiters = 0;
    let allYields: number[] = [];
    let totalProcessedOlives = 0;

    const filteredHarvests = this.filtrarHarvests();

    const filteredFincas = this.fincas.filter(f =>
      (f.harvests || []).some(h => this.selectedYear === 'all' || h.year === this.selectedYear)
    );

    const totalSurface = filteredFincas.reduce((acc, f) => acc + (f.surface || 0), 0);
    const totalOliveTrees = filteredFincas.reduce((acc, f) => acc + (f.oliveAmount || 0), 0);

    for (const h of filteredHarvests) {
      totalOlives += h.olivesHarvestedKg;
      totalOilKg += h.olivesHarvestedKg * h.oilYieldPercent / 100;
      totalOilLiters += (h.olivesHarvestedKg * h.oilYieldPercent / 100) / 0.92;
      allYields.push(h.oilYieldPercent);
      totalProcessedOlives += h.olivesHarvestedKg;
    }

    const numHarvests = filteredHarvests.length;

    this.totalOlives = totalOlives;
    this.totalOil = totalOilKg;
    this.averageOlives = totalOliveTrees > 0 ? totalOlives / totalOliveTrees : 0;
    this.averageYield = allYields.reduce((a, b) => a + b, 0) / (allYields.length || 1);
    this.productionPerHectare = totalSurface > 0 ? totalOlives / totalSurface : 0;
    this.totalProcessedOlives = totalProcessedOlives;
    this.totalOilInLiters = totalOilLiters;

    this.title = this.selectedYear === 'all'
      ? "Estadísticas de producción (todos los años)"
      : `Estadísticas de producción para el año ${this.selectedYear}`;
  }

  generarGrafica(): void {
    const yearlyTotals: { [year: number]: number } = {};

    for (const finca of this.fincas) {
      for (const h of finca.harvests || []) {
        if (this.selectedYear === 'all' || h.year === this.selectedYear) {
          yearlyTotals[h.year] = (yearlyTotals[h.year] || 0) + h.olivesHarvestedKg;
        }
      }
    }

    const sortedYears = Object.keys(yearlyTotals).sort();
    this.chartData = {
      labels: sortedYears,
      datasets: [
        {
          data: sortedYears.map(year => yearlyTotals[+year]),
          label: 'Aceitunas cosechadas (kg)',
          backgroundColor: '#81c784',
          hoverBackgroundColor: '#66bb6a',
        }
      ]
    };
  }

  generarGraficaGrados(): void {
    const yearlyGrades: { [year: number]: number[] } = {};

    for (const finca of this.fincas) {
      for (const h of finca.harvests || []) {
        if (this.selectedYear === 'all' || h.year === this.selectedYear) {
          if (!yearlyGrades[h.year]) {
            yearlyGrades[h.year] = [];
          }
          yearlyGrades[h.year].push(h.oilYieldPercent);
        }
      }
    }

    const labels = Object.keys(yearlyGrades).sort();
    this.gradeChartData = {
      labels: labels,
      datasets: [
        {
          data: labels.map(year => {
            const grades = yearlyGrades[+year];
            return grades.reduce((a, b) => a + b, 0) / grades.length;
          }),
          label: 'Rendimiento de aceite (%)',
          borderColor: '#42a5f5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  generarGraficaCompleja(): void {
    const scatterData: { x: number, y: number }[] = [];

    for (const finca of this.fincas) {
      for (const h of finca.harvests || []) {
        if (this.selectedYear === 'all' || h.year === this.selectedYear) {
          scatterData.push({
            x: h.olivesHarvestedKg,
            y: h.olivesHarvestedKg * h.oilYieldPercent / 100
          });
        }
      }
    }

    this.scatterChartData = {
      datasets: [
        {
          data: scatterData,
          label: 'Relación aceitunas y aceite',
          pointBackgroundColor: '#42a5f5',
          pointRadius: 5
        }
      ]
    };
  }

  onYearChange(): void {
    this.calcularEstadisticas();
    this.generarGrafica();
    this.generarGraficaGrados();
    this.generarGraficaCompleja();
    this.cdr.detectChanges();
  }
}
