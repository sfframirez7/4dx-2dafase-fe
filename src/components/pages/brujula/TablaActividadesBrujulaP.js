import React, { Component } from 'react';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import NoData from '../../common/NoData'
import { axios, JwtPayload } from "../../../config/config";
import Swal from "sweetalert2";

import EstadoActividad from './EstadoActividad'

class TablaActividadesBrujulaP extends Component {
    constructor(props)
    {
        super(props)

        this.state = {
            Actividades :  this.props.Actividades,
        }
        this.ObtenerActividades = this.ObtenerActividades.bind(this)

    }


    componentDidMount()
    {
        //  this.ObtenerActividades();
    }



    
    ObtenerActividades()
    {
        
        var usuario =""

        if(this.props.colaboradorSelected.colaboradorId)
        {
            usuario = this.props.colaboradorSelected.colaboradorId
        }
        else 
        {
            var user = JwtPayload().usuario      
            usuario = user.Empleado

            var colaborador = {
                nombreColaborador : user.EmpleadoNombre,
                colaboradorId : user.Empleado
            }

            this.props.dispatch({type:'ACTUALIZAR_COLABORADOR', data: colaborador}) 

        }

        axios.get("/BrujulaActividadesPorColaborador/"+ usuario + "/4/NO")
        .then(res => {
            // this.props.dispatch({type:'LOAD_BRUJULAS', data: res.data}) 
            console.log(res.data)
            this.setState({cargando : false, Actividades : res.data})

        }).catch((error) => {
            this.setState({cargando : false})
            console.log(error)
            Swal.fire({  
                title: 'Algo ha salido mal',  
                type: 'error',  
                text: "Atención",  
            });
            return
        })
    }



    render() {
        return (
            <div>
                
                <div className="row">
                    <div className="col text-center">
                        <NoData NoData={this.props.Actividades.length === 0 && !this.state.cargando}/>  
                    </div>
                </div>
                <div className={"row " }>
                        <div className="col">

                        <div className="list-group">
                                                           
                                {this.props.Actividades.map((brujula, index)=>
                                    {
                                        return <div key={index} className="list-group-item list-group-item-action flex-column align-items-start">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{brujula.Actividad}</h5>
                                                <small className="text-muted"><Moment fromNow>{brujula.FechaCreada}</Moment></small>
                                            </div>
                                            <div className="row">
                                                    <div className="col-12 col-md-3 ">
                                                        <EstadoActividad
                                                                Descripcion={brujula.Descripcion}
                                                                Brujula={brujula.IdBrujula}
                                                                ResultadoId={this.state.IdColaborador}
                                                                ActividadComoLider={brujula.ActividadComoLider}
                                                                UsuarioId={brujula.IdColaborador} />
                                                    </div>
                                                    <div className={"col text-right " + (brujula.ActividadComoLider ? "" : "d-none") }>

                                                        <span className="badge badge-warning">Actividad como líder</span>
                                                    </div>
                                                </div>
                                            <p className="mb-1">
                                                Desde: <Moment format="YYYY/MM/DD">{brujula.Desde}</Moment> - 
                                                Hasta  <Moment format="YYYY/MM/DD">{brujula.Hasta}</Moment>
                                            </p>
                                            <small className="text-muted">Modificada: <Moment format="YYYY/MM/DD">{brujula.FechaModificada}</Moment></small>
                                        
                                        </div>
                                    
                                })}
                        
                        </div>


                        </div>
                    </div>

            </div>
        );
    }
}


function mapStateToProps(state) {

    return {
        Actividades : state.BrujulaReducer.filter((actividad) =>{
            if (actividad.IdEstado === 4 )
                return true
            else
                return ""
        }),
         colaboradorSelected : state.ColaboradorSelectedReducer,
    };

}

export default connect(
    mapStateToProps,
)(TablaActividadesBrujulaP);