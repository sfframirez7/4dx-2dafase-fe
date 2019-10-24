import React from 'react'

import { Link } from "react-router-dom";
import Swal from "sweetalert2";  

import './MedidasPredictivas.css'


class MedidaPredictiva extends React.Component {


    constructor(props)
    {
        super(props)

        var dataBase64 = btoa(JSON.stringify(this.props.Metrica[0]))

        // console.log(this.props.Metrica)

        this.state = {
            metricas : this.props.Metrica,
            edit : false,
            periodos : [],
            frecuencia : (this.props.Metrica.Frecuencia) ? (this.props.Metrica.Frecuencia) : "" ,
            frecuenciaId : 0,
            medicion : (this.props.Metrica.Medicion) ? this.props.Metrica.Medicion : "",
            medicionId : 0,
            mediciones : [],
            debeEditarMeta : false,
            urlParams : dataBase64
        }

        

        this.MostrarAlertaConfigurar = this.MostrarAlertaConfigurar.bind(this)
    }

    componentDidMount()
    {

        if(this.state.metricas[0].AutorizadoMCI )
        {
            this.setState({debeEditarMeta : true})
        }
    }

    MostrarAlertaConfigurar()
    {
        Swal.fire({
            title: "Debes configurar tus metas para poder acceder a tus resultados",
            type: 'warning',
            text: "Atención",
        });
    }

   
    render() {

     return (

        <div className="row p-1">
                        
        <div className="col-12">
            <div className="card bp-card">
                <div className="card-body p-0">
                    
                    <div className="row mb-1">
                        <div className="col text-right">
                            <Link to={{
                                pathname: '/configuracion/'+this.state.urlParams
                                }}>
                                <button className=" btn btn-info m-1 " data-toggle="tooltip" data-placement="top" title="Configurar medida" >
                                    <i className="fa fa-wrench m-1" aria-hidden="true"></i>
                                    Configurar
                                </button>
                            </Link>
                        </div>

                    </div>

                    <div className="row p-0">
                        <div className="col-12 col-md-2 col-lg-1">
                            <h4 className="card-title">MCI  {" #"+this.state.metricas[0].Orden} </h4>
                        </div>
                        <div className="col-12 col-md-11">
                            {this.state.metricas[0].MCI }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                                
                                
                                {this.state.debeEditarMeta ? 
                                ( <button type="button" className="btn btn-secondary" onClick={this.MostrarAlertaConfigurar}>Resultados MCI</button>
                                   
                                ) : (
                                    <Link to={{
                                        pathname: '/resultadosMCI/'+btoa(this.state.metricas[0].IdMCI),
                                        medidaPredictiva: this.state.metricas[0],
                                        }}>
                                        <button 
                                            className="btn btn-outline-primary m-2" 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Ingresar resultados MCI" >
                                            Resultados MCI
                                        </button>
                                    </Link>
                                ) }

                        </div>
                    </div>
                    {this.state.metricas.map((metrica, index)=> {
                        return (
                            <div className="m-4 p-2" key={index}>

                                <div className="row p-1">
                                    <div className="col-12 col-md-2 col-lg-1">
                                        <h4 className="card-title">MP</h4>
                                        
                                    </div>
                                    <div className="col-12 col-md-11">
                                        <p>
                                            {metrica.MedidaPredictiva}  
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                    {this.state.debeEditarMeta ? 
                                            ( <button type="button" className="btn btn-secondary" onClick={this.MostrarAlertaConfigurar}>Resultados Medida Predictiva</button>
                                            
                                            ) : (
                                                <Link to={{
                                                    pathname: '/resultadosMedidasPredictiva/'+btoa(metrica.IdMP),
                                                    medidaPredictiva: this.state.metricas,
                                                    }}>
                                                    <button className=" btn btn-outline-primary m-1" data-toggle="tooltip" data-placement="top" title="Ingresar resultados" >
                                                        Resultados MP
                                                    </button>
                                                </Link>
                                            ) }
                                    
                                    </div>
                                </div>
                                <div className="row p-1">
                                    <div className="col-12 col-md-6 text-center">
                                        <h4 className="card-title">Frecuencia</h4>
                                        {metrica.Frecuencia}
                                    </div>
                                    <div className="col-12 col-md-6 text-center">
                                        <h4 className="card-title">Tipo Medición</h4>
                                        {metrica.Medicion}
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                                       
                </div>
            </div>
        </div>

    </div>
    
     )

    }
}

export default MedidaPredictiva