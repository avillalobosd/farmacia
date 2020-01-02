import React from 'react';
import '../styles/BarraDerecha.css';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import List from '@material-ui/core/List';
// import ButtonGroup from '@material-ui/core/ButtonGroup';
// import { fontSize } from '@material-ui/system';
import Typography from '@material-ui/core/Typography';
// import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
// import CloseIcon from '@material-ui/icons/Close';
var PouchDB = require('pouchdb').default;
var dbinventario = new PouchDB('http://localhost:5984/inventario');





const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));


class Inventario extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            inventario: [],
            inputSell: "",
            codigo: "",
            nombreProducto: "",
            descripcion: "",
            cantidadDisponible: "",
            cantidadAgregar: 0,
            precioUnidad: "",
            activeSearch: false,
            edit: true,
            show: false,
            seleccionado: "",
            productoEditar: null,
            rev: "",
            editCantidad: true,
            editAgregar: true,
            nuevo: false,
            helperCantidad: "",
            helperDescripcion: "",
            helperPrecio: "",
            helperProducto: "",
            errorCantidad: false,
            errorDescripcion: false,
            errorPrecio: false,
            errorProducto: false
        };

        this._onKeyPress = this._onKeyPress.bind(this);
        this._onChange = this._onChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleModifica = this.handleModifica.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleNuevo = this.handleNuevo.bind(this);
        this.getAllNotes = this.getAllNotes.bind(this);
        this.handleGuardarCambios = this.handleGuardarCambios.bind(this);
        this.handleClickTable = this.handleClickTable.bind(this);
        this.buscar = this.buscar.bind(this);
    }

    componentDidMount() {

        this.getAllNotes().then(data => {
            let array = Object.values(data);
            this.setState({
                inventario: array
            });
            console.log(this.state.inventario);

        })
    }

    _onKeyPress(event) {

        if (event.charCode === 13) {
            this.buscar(this.state.inputSell).then(data => {
                if (data.mensaje == "NO") {
                    this.setState({
                        show: true
                    });
                    console.log("NO EXISTE EL PRODUCTO")
                } else {
                    console.log(data.producto);
                    console.log("SI EXISTE EL PRODUCTO")
                    this.handleModifica(data.producto);
                }

            })

        }
    }

    _onChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleClose = event => {
        this.setState({
            show: false,
            inputSell: ""
        });
    };

    handleCancel = event => {
        this.setState({
            edit: true,
            activeSearch: false,
            codigo: "",
            nombreProducto: "",
            descripcion: "",
            cantidadDisponible: "",
            precioUnidad: "",
            cantidadAgregar: "",
            inputSell: "",
            editCantidad: true,
            errorProducto: false,
            helperProducto: "",
            errorCantidad: false,
            helperCantidad: "",
            errorPrecio: false,
            helperPrecio: ""
        });
    };

    handleNuevo = event => {
        this.setState({
            edit: false,
            activeSearch: true,
            codigo: this.state.inputSell,
            show: false,
            editCantidad: false,
            nuevo: true
        });

    };

    handleClickTable (event) {
        this.setState({
            codigo: "",
            nombreProducto: "",
            descripcion: "",
            cantidadDisponible: "",
            precioUnidad: "",
            cantidadAgregar: "",
            inputSell: ""
        });

        this.buscar(event.target.id).then(data => {
            if (data.mensaje == "NO") {
                this.setState({
                    show: true
                });
                console.log("NO EXISTE EL PRODUCTO")
            } else {
                console.log(data.producto);
                console.log("SI EXISTE EL PRODUCTO")
                this.handleModifica(data.producto);
            }

        })

    };



    handleModifica(producto) {
        this.setState({
            inputSell: "",
            edit: false,
            editAgregar: false,
            activeSearch: true,
            codigo: producto._id,
            nombreProducto: producto.nombre,
            descripcion: producto.descripcion,
            cantidadDisponible: producto.cantidad,
            precioUnidad: producto.precio,
            rev: producto._rev
        });
    };
    handleGuardarCambios() {
        this.setState({
            errorProducto: false,
            helperProducto: "",
            errorCantidad: false,
            helperCantidad: "",
            errorPrecio: false,
            helperPrecio: ""
        })
        if (this.state.nombreProducto == "" || this.state.cantidadDisponible == "" || this.state.precioUnidad == "") {
            if (this.state.nombreProducto == "") {
                this.setState({
                    errorProducto: true,
                    helperProducto: "Campo Requerido"
                })
            }
            if (this.state.cantidadDisponible == "") {
                this.setState({
                    errorCantidad: true,
                    helperCantidad: "Campo Requerido"
                })
            }
            if (this.state.precioUnidad == "") {
                this.setState({
                    errorPrecio: true,
                    helperPrecio: "Campo Requerido"
                })
            }

            console.log("FALTA INFORMACION")
        }
        else if (this.state.nuevo == false) {
            var suma = 0;
            if (this.state.cantidadAgregar == null || this.state.cantidadAgregar == "") {
                suma = 0
            } else {
                suma = this.state.cantidadAgregar
            }

            let doc = {
                id: this.state.codigo,
                _id: this.state.codigo,
                nombre: this.state.nombreProducto,
                descripcion: this.state.descripcion,
                cantidad: parseInt(suma) + parseInt(this.state.cantidadDisponible),
                precio: this.state.precioUnidad,
                _rev: this.state.rev,
            }
            dbinventario.put(doc);

            this.setState({
                edit: true,
                activeSearch: false,
                codigo: "",
                nombreProducto: "",
                descripcion: "",
                cantidadDisponible: "",
                precioUnidad: "",
                cantidadAgregar: ""
            });

            this.getAllNotes().then(data => {
                let array = Object.values(data);
                this.setState({
                    inventario: array
                });
                console.log(this.state.inventario);

            })
            window.location.reload();
        } else {

            let doc = {
                id: this.state.inputSell,
                _id: this.state.codigo,
                nombre: this.state.nombreProducto,
                descripcion: this.state.descripcion,
                cantidad: this.state.cantidadDisponible,
                precio: this.state.precioUnidad
            }
            dbinventario.put(doc);

            this.setState({
                edit: true,
                activeSearch: false,
                codigo: "",
                nombreProducto: "",
                descripcion: "",
                cantidadDisponible: "",
                precioUnidad: "",
                cantidadAgregar: "",
                nuevo: false
            });

            this.getAllNotes().then(data => {
                let array = Object.values(data);
                this.setState({
                    inventario: array
                });
                console.log(this.state.inventario);

            })
            window.location.reload();







        }
    };


    async getAllNotes() {
        let allNotes = await dbinventario.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);

        return notes;
    };

    async buscar(codigo) {
        let ret = {
            mensaje: "NO",
            producto: {}
        }


        this.state.inventario.map(function (ok) {
            if (ok._id == codigo) {
                let productoEditar = ok;


                ret.mensaje = "SI";
                ret.producto = ok;
            }
        })
        return ret;

    };



    handleShow() {
        this.setState({
            show: true
        });
    };

    render() {
        return (
            <Grid container style={{ backgroundColor: '#dddddd' }} >

                <Grid item xs={1} style={{ backgroundColor: '#dddddd' }}  ></Grid>
                <Grid item xs={6}>
                    {/* <Grid textAlign={'center'} xs={2} container style={{ backgroundColor: '#dddddd', height: '100vh' }} > </Grid> */}
                    <Grid style={{ backgroundColor: '#dddddd', height: '100%' }} >

                        <FormControl fullWidth noValidate autoComplete="off">
                            <TextField disabled={this.state.activeSearch} name={"inputSell"} onChange={this._onChange} onKeyPress={this._onKeyPress} id="outlined-basic" variant="outlined" value={this.state.inputSell} style={{ width: "100%", marginTop: "50px" }} />
                            <List>

                                <Paper style={{ overflow: 'auto', height: '55vh', marginTop: "30px" }}>

                                    <div >

                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">ID</TableCell>
                                                    <TableCell align="center">Nombre</TableCell>
                                                    {/* <TableCell align="right">Descripcion</TableCell> */}
                                                    <TableCell align="center">Cantidad Disponible</TableCell>
                                                    <TableCell align="center">Precio Unidad</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {this.state.inventario.map((producto, index, key) => {


                                                    return (
                                                        <TableRow hover id={producto._id} onClick={this.handleClickTable} key={index}>
                                                            <TableCell id={producto._id} align="center">{producto._id}</TableCell>
                                                            <TableCell id={producto._id} align="center">{producto.nombre}</TableCell>
                                                            {/* <TableCell align="right">{producto.descripción}</TableCell> */}
                                                            <TableCell id={producto._id} align="center">{producto.cantidad}</TableCell>
                                                            <TableCell id={producto._id} align="center">{producto.precio}</TableCell>
                                                        </TableRow>

                                                    )
                                                })}

                                            </TableBody>
                                        </Table>
                                    </div>
                                </Paper>

                            </List>

                        </FormControl>

                    </Grid>


                </Grid>




                <Grid item xs={1} style={{ backgroundColor: '#dddddd', height: '100vh' }}></Grid>
                <Grid item xs={4}>

                    <TextField
                        disabled={true}
                        label="Codigo"
                        name={"codigo"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.codigo}
                        style={{
                            width: "90%",
                            marginTop: "50px"
                        }} />

                    <TextField
                        error={this.state.errorProducto}
                        helperText={this.state.helperProducto}
                        disabled={this.state.edit}
                        label="Nombre Producto"
                        name={"nombreProducto"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.nombreProducto}
                        style={{ width: "90%", marginTop: "50px" }} />

                    <TextField
                        error={this.state.errorDescripcion}
                        helperText={this.state.helperDescripcion}
                        disabled={this.state.edit}
                        label="Descripción"
                        name={"descripcion"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.descripcion}
                        style={{ width: "90%", marginTop: "50px" }} />

                    <TextField
                        error={this.state.errorCantidad}
                        helperText={this.state.helperCantidad}
                        disabled={this.state.editCantidad}
                        type="number"
                        label="Disponible"
                        name={"cantidadDisponible"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.cantidadDisponible}
                        style={{ width: "40%", marginTop: "50px" }} />

                    <TextField
                        disabled={this.state.editAgregar}
                        type="number" label="Agregar"
                        name={"cantidadAgregar"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.cantidadAgregar}
                        style={{ width: "40%", marginTop: "50px" }} />

                    <TextField
                        error={this.state.errorPrecio}
                        helperText={this.state.helperPrecio}
                        disabled={this.state.edit}
                        type="number"
                        label="Precio Unidad"
                        name={"precioUnidad"}
                        onChange={this._onChange}
                        variant="outlined"
                        value={this.state.precioUnidad}
                        style={{ width: "90%", marginTop: "50px" }} />

                    <br></br><br></br><br></br>

                    <Button
                        disabled={this.state.edit} variant="outlined" color="primary" onClick={this.handleGuardarCambios}>Guardar</Button>
                    <Button disabled={this.state.edit} variant="outlined" color="secondary" onClick={this.handleCancel}>Cancelar</Button>
                </Grid>

                <Dialog
                    open={this.state.show}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"No se encuentra Producto en el Inventario"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ¿Desea agregar el producto?
          </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleNuevo} color="primary">
                            Si
          </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            No
          </Button>
                    </DialogActions>
                </Dialog>




            </Grid>


        );
    }
}

export default Inventario;