import React from 'react'
import { connect } from 'react-redux';

import TipoGrafico from '../graficas/TipoGrafico'
import TablaResultadoMP from './TablaResultadoMP' 
import Medicion from '../../../models/Medicion'
import Frecuencia from '../../../models/Frecuencia'

import { Link } from "react-router-dom";

import { axios } from "../../../config/config";
import Swal from "sweetalert2";

import ObtenerCriterio from '../../../Functions/ObtenerCriterio'

class TableroMP extends React.Component {

    constructor(props)
    {
        super(props)
        //console.log(this.props.TableroMP)
        this.state = {
            MedidaPredictiva : this.props.MedidaPredictiva,
            unidad : (this.props.MedidaPredictiva.ResultadosMP ? this.props.MedidaPredictiva.ResultadosMP[0].Unidad : "" ),
            cargando : false,
            data : [],
            idTipoGrafico : 2,
            dataBar : {},
            dataB64 : "",
            Actividades : [],
            mesSelected : this.props.mesSelected,
            dataPeriodo : []
        }
        this.FormatearDataAGraficar = this.FormatearDataAGraficar.bind(this)
        this.ObtenerActividadesMP = this.ObtenerActividadesMP.bind(this)
    }
    

    componentDidMount()
    {
        if(this.state.MedidaPredictiva.MedicionId === Medicion.Resultado)
        {
            this.FormatearDataAGraficar()
        }
        // this.ObtenerActividadesMP();
    }


    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({MedidaPredictiva : newProps.MedidaPredictiva});
        this.FormatearDataAGraficar()
    }

    ObtenerActividadesMP()
    {

        axios.get("/BrujulaActividadesPorMP/"+this.state.MedidaPredictiva.IdMP+"/"+this.state.mesSelected )
        .then(res => {

            this.setState({Actividades : res.data})

        }).catch((error) => {
            console.log(error)
            Swal.fire({  
                title: 'Algo ha salido mal',  
                type: 'error',  
                text: "Atención",  
            });
            return
        })
    }

    FormatearDataAGraficar() 
    {
        var dataBar = {
            idTipoGrafico : 3,
            labels: [],
            
            datasets: [
                {
                    label: 'Resultado',
                    type : 'bar',
                    backgroundColor: [],
                    data: []
                },
                {
                    label: 'Meta',
                    type : 'line',
                    borderWidth: 2,
                    borderColor: '#2196F3',
                    data: []
                }                
            ] 
        };

        var dataPeriodo =[]

      
        if(!this.state.MedidaPredictiva.ResultadosMP)
        {
            dataBar.labels.push("Meta")
            dataBar.datasets[1].data.push(this.state.MedidaPredictiva.MetaMP)
            this.setState({dataBar : dataBar, dataB64 : JSON.stringify(dataBar)})
            return
        }

        this.state.MedidaPredictiva.ResultadosMP.map((resultado, index) => {

            
            if(this.state.MedidaPredictiva.FrecuenciaId === Frecuencia.Semanal)
                dataBar.labels.push("Semana " +resultado.Semana)
            else
                dataBar.labels.push("Día " +resultado.Dia)

            var criterioV = this.state.MedidaPredictiva.CriterioVerde
            var criterioR = this.state.MedidaPredictiva.CriterioRojo
                
            dataBar.datasets[0].backgroundColor.push(ObtenerCriterio(resultado.Valor,criterioV, criterioR))

            dataBar.datasets[0].data.push(resultado.Valor)
            

            dataBar.datasets[1].data.push(this.state.MedidaPredictiva.MetaMP)
            
            dataPeriodo.push(resultado.Periodo)
            return ""
        })        
        this.setState({dataBar : dataBar, dataB64 : JSON.stringify(dataBar), dataPeriodo})
    }



    render(){
        //console.log(this.state.MedidaPredictiva.ResultadosMP)
        return (
            <div>
                 <div className="row my-4">
                    <div className={"col-12 col-md-4 " + (this.props.estilosTablero.textoALaDerecha  ? "order-2" : "" ) } >
                        <h5 className="font-weight-bold" style={ this.props.estilosTablero.Titulo}>MP {" #"+ this.state.MedidaPredictiva.OrdenMP}</h5>
                        <p className="card-text" style={ this.props.estilosTablero.Texto}>
                            {this.state.MedidaPredictiva.MedidaPredictiva}
                        </p>
                    </div>
                    <div className="col-12 col-md-8 text-right">                        
                        {this.state.MedidaPredictiva.MedicionId === Medicion.Meta ?(
                            <TablaResultadoMP MedidaPredictiva={this.state.MedidaPredictiva}/>) :
                            (
                            <div>
                                <Link to={{
                                    pathname: '/chart/'+ btoa(this.state.dataB64)
                                }}>
                                    <i className="fa fa-arrows-alt" aria-hidden="true"></i>
                                </Link>
                                <TipoGrafico type={3} data={this.state.dataBar}/>
                            </div>
                            
                        
                            
                        )}

                    </div>
                </div>

                <div className="row">
                    <div className="col">
                    <p>
                                    <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#divTablaMP" aria-expanded="false" aria-controls="collapseExample">
                                        <i className="fa fa-table" aria-hidden="true"></i>
                                        <span className="m-1">
                                            Tabla Data MP
                                        </span>
                                    </button>
                                </p>
                                <div className="collapse" id="divTablaMP">
                                    <div className={(!this.state.MedidaPredictiva.ResultadosMP ? "d-none" : "")} >
                                        <div style={{overflowX: "auto"}}>

                                            <table className="table table-bordered table-sm">
                                           
                                                <thead>
                                                    
                                                    <tr>
                                                        <th>Valor</th>                                                                
                                                        {!this.state.dataBar.labels ? null : (                                                        
                                                        this.state.dataBar.labels.map((label, index) =>{
                                                            return (                                                                
                                                                <th key={index}>{label }</th>                                                                  
                                                                )
                                                            })
                                                        )}                                                        
                                                    </tr>  
                                                    <tr>
                                                        <th>Periodo</th>
                                                        {this.state.dataPeriodo.map((periodo, index)=> {
                                                            return(
                                                                <td key={index}>{periodo }</td>        
                                                            )
                                                        })}
                                                    </tr>                                            
                                                </thead>

                                                <tbody>
                                                    <tr>
                                                    <th scope="row">Resultado</th>
                                                        {!this.state.dataBar.labels ? null : (

                                                            this.state.dataBar.datasets[0].data.map((valor, index) =>{
                                                                return (
                                                                    <td key={index}>{valor + " " +this.state.unidad}</td>        
                                                                )
                                                            })
                                                        )}
                                                    </tr>
                                                    <tr>
                                                    <th scope="row">Meta</th>
                                                    {!this.state.dataBar.labels ? null : (

                                                        this.state.dataBar.datasets[1].data.map((valor, index) =>{
                                                            return (
                                                                <td key={index}>{valor + " " +this.state.unidad}</td>        
                                                            )
                                                        })
                                                        )}
                                                    </tr>
                                                    
                                                </tbody>
                                            </table>
                                            </div>
                                    </div>
                                </div>

                    </div>
                </div>

                <div className="row d-none">
                        
                    <div className="col">
                        <p className="text-center">
                           
                            <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#divActividades" aria-expanded="false" aria-controls="collapseExample">
                                <span className="m-1">
                                    Brújula
                                </span>
                                <i className="fa fa-compass" aria-hidden="true"></i>
                            </button>
                        </p>

                    </div>

                </div>

                <div className="row">
                    <div className="col-12 col-md-4 text-center text-md-right">
                        <span className="bg-success p-2"> </span>
                        <span className="font-weight-bold m-1 text-meta">
                            {this.state.MedidaPredictiva.CriterioVerde }
                        </span>

                    </div>
                    
                    

                    {this.state.MedidaPredictiva.CriterioAmarillo ? (
                        <div className="col-12 col-md-4 text-center ">
                            <span className="bg-warning p-2"> </span>
                            <span className="font-weight-bold m-1 text-meta">
                                { this.state.MedidaPredictiva.CriterioAmarillo }
                            </span>
                        </div>
                    ):
                    (
                        <div className="col-12 col-md-4 text-center ">
                        </div>
                    )}


                    <div className="col-12 col-md-4 text-center text-md-left">
                        <span className="bg-danger p-2"> </span>
                        <span className="font-weight-bold m-1 text-meta">
                            {this.state.MedidaPredictiva.CriterioRojo }
                        </span>

                    </div>
                </div>
            </div>
        )
    }
}



function mapStateToProps(state) {
    
    return {
        actividades : state.BrujulaReducer,
        mesSelected : state.MesSelectReducer,
        estilosTablero : state.EstilosTableroReducer
    };
}

export default connect(
    mapStateToProps,
)(TableroMP);