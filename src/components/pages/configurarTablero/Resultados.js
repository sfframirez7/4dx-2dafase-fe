import React, { Component } from 'react';
import { connect } from 'react-redux';

import MedidaPredictiva from '../medidasPredictivas/MedidaPredictiva'
import TituloPrincipal from '../../common/TituloPrincipal'
import Loading from '../../common/Loading'
import NoData from '../../common/NoData'

import { axios, JwtPayload } from "../../../config/config";

import Swal from "sweetalert2";

class Resultados extends Component {
    
    
    constructor(props) {
        super(props)
        
        this.state = {
            metricas : [],
            metas : [],
            periodos : [],
            cargando : false
        }
        
        this.getMedidasPredictivas = this.getMedidasPredictivas.bind(this)
    }

    componentDidMount() {
        this.getMedidasPredictivas()
    }


    getMedidasPredictivas() {

        var usuario = JwtPayload().usuario      

        this.setState({cargando : true})

        axios.get('/GetMetasColaborador/'+usuario.Empleado)

        .then(res => {
            this.setState({metas : res.data})
            this.setState({cargando : false})
 
        }).catch((error) => {
            this.setState(state => ({ cargando: false }));
            Swal.fire({
                title: "Error",
                type: 'error',
                text: "Error",
            });

        })
    }


    
    render() {
        return (
            <div>
                <div className="container mb-4">
                
                    <div className="row">
                        <div className="col">
                            <TituloPrincipal Titulo="Resultados" />
                        </div>
                    </div>
                
                    <div className="row">
                        <div className="col text-center">
                            <Loading Cargando={this.state.cargando}/>
                        </div>
                    </div>

                    
                    {/* <div className="row">
                        <div className="col-12 col-md-10 offset-md-1 text-center">
                            <AlertaEditarMedida />
                        </div>
                    </div> */}
                    
                    
                    <div className="row">
                        <div className="col text-center">
                            <NoData NoData={this.state.metas.length === 0 && !this.state.cargando}/>
                        </div>
                    </div>

                    {/* <div className="row">
                        <div className="col-12">
                            <table className="table table-striped table-hover  bg-white">
                                <thead className=" ">
                                    <tr>
                                    <th>#</th>
                                    <th>MCI</th>
                                    <th colSpan="2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.metas.map((meta, index)=> {
                                        return (
                                            <tr key={index}>
                                                <th>
                                                    {meta.Orden}
                                                </th>
                                                <td>
                                                    {meta.MCI}
                                                </td>
                                                <td>
                                                    <Link to={{
                                                        pathname: '/resultadosMCI/'+btoa(meta.IdMCI)
                                                        }}>
                                                        <button 
                                                            className="btn btn-outline-primary m-2" 
                                                            data-toggle="tooltip" 
                                                            data-placement="top" 
                                                            title="Ingresar resultados MCI" >
                                                            Resultados MCI
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                        </div>
                    </div> */}

                    {this.state.metas.map((meta, index) => {
                        return (<MedidaPredictiva DataKey={index} key={index} Metrica={meta} />)
                    })}

                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {

    };

}


export default connect(
    mapStateToProps,
)(Resultados);