import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ApiService } from 'src/app/core/api/api.service';
import { Conductor } from 'src/app/models/conductor';

@Component({
  selector: 'vex-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {


  cargando = false;

  fecha_inicio = "";
  fecha_fin = "";


  data = [];
  data_gr1 = [];
  data_gr2 = [];
  data_gr3 = [];
  data_gr4 = [];

  gradient:boolean=false;

  colorScheme = {
    domain: ['#4CAF50','#E53935', '#283593', '#00695C', '#D81B60']
  };

  view: any[] = [700, 400];

  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;

  yAxisLabel: string = 'Conductor';
  xAxisLabel: string = 'M3';

  yAxisLabel_gr3: string = 'Autobomba';
  xAxisLabel_gr3: string = 'M3';


  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
  });

  dateChange(event: any) {
    console.log("datechange");
    this.loadAppointmentPaginator();
  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  loadAppointmentPaginator() {

    this.cargando = true;

    const data = this.filters.value;
    const date = data.date ? `date: "${moment(data.date).format('YYYY-MM-DD')}",`:`date: "${moment().format('YYYY-MM-DD')}",`;
    const date2 = data.date2 ? `date2: "${moment(data.date2).format('YYYY-MM-DD')}",`:`date2: "${moment().format('YYYY-MM-DD')}",`;

    const queryParams = `${date}${date2}`;

    console.log("Se está cargando la data, estos son los params: ", queryParams);

    const queryProps =
        'data{id, name, company, hora_descargue, fecha_pago, hora_llegada, hora_fin, observaciones, value, date, app_user_id, updated_at, patient_id, tipo_descarga, time, end_time, conductor, vendedor, metros, type_concreto, id_type_concreto, direccion, status, type, email_confirmation, phone_confirmation, reason, type, producto{id, nombre, precio}, patient{ id, name, color  }, doctor{ id, name, }, credito{id, estado} }, total';

    this.apiService.getAppointmentPagination(queryParams, queryProps).subscribe(
        (response: any) => {
          this.data = response.data.appointmentsPagination.data;

          this.cargando = false;

          this.getGrafica1(this.data);
          this.getGrafica2(this.data);
          this.getGrafica3(this.data);
          this.getGrafica4(this.data);
        },
        error => {
            console.log(error);
        }
    );
  }

  getGrafica1(_data){
    let despachado = _data.filter((data)=>{
      return data.status == '3';
    });

    let no_despachado = _data.filter((data)=>{
      return data.status != '3';
    });
    
    this.data_gr1 = [
      {
        "name": "Despachado",
        "value": despachado.length
      },
      {
        "name": "No despachado",
        "value": no_despachado.length
      }
            ];
  }

  getGrafica2(_data){
    //Solo vamos a tomar en cuenta los pedidos que han sido despachados
    const pedidos_despachados = _data.filter((data)=>{
      return data.status == '3';
    });

    let _conductores_detectados = [];
    
    pedidos_despachados.map((data_pedido)=>{
      let conductor_existe = false;
      _conductores_detectados.map((data_conductor)=>{
      if(data_pedido.conductor == data_conductor.name){
        data_conductor.value = parseFloat(data_conductor.value) + parseFloat(data_pedido.metros);
        conductor_existe = true;
      }
    });
    
    if(conductor_existe == false){
      _conductores_detectados.push({"name":data_pedido.conductor,"value":parseFloat(data_pedido.metros)});
    }
    
    });
    
              this.data_gr2 = _conductores_detectados;
  }

  getGrafica3(_data){

          
    const pedidos_despachados = _data.filter((data)=>{
      return data.status == '3';
    });


          let bombas = [
            {"name":"Autobomba 1","value":0},
            {"name":"Autobomba 2","value":0},
            {"name":"SP 750","value":0},
            {"name":"SP 500","value":0},
            {"name":"Directa","value":0},
            {"name":"Reeds A40","value":0},
          ];

          pedidos_despachados.map((data_pedido)=>{

            
            bombas.map((data_bomba)=>{
              if(data_pedido.tipo_descarga == data_bomba.name){
                data_bomba.value = data_bomba.value + parseFloat(data_pedido.metros);
              }

            });

          }
          );

          this.data_gr3 = bombas;
  }

  getGrafica4(_data){
    const no_pagados = _data.filter((data)=>{
      return data.credito.status == '1';
    });

    const mora = _data.filter((data)=>{
      return data.status != '2';
    });

    const pagado = _data.filter((data)=>{
      return data.status != '3';
    });

    this.data_gr4 = [
      {
        "name": "Pagado",
        "value": pagado.length
      },
      {
        "name": "En Mora",
        "value": mora.length
      },
      {
        "name": "No pagados",
        "value": no_pagados.length
      }
      
            ];
  }


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAppointmentPaginator();
  }

}
