import React from 'react'

class BtnLogOut extends React.Component {

    constructor(props) {
        super(props)

        this.LogOut = this.LogOut.bind(this);
    }

    LogOut() {
        localStorage.removeItem("usr_token")
        window.location.href = "/";

    }


    render() {
        return ( <button type = "button" className = "btn btn-danger" onClick = { this.LogOut } > Cerrar Sesión < i className = "fa fa-sign-out aria - hidden = true " > </i></button>
        )
    }
}

export default BtnLogOut