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
var PouchDB = require('pouchdb').default;
var dbenventa = new PouchDB('http://localhost:5984/enventa');
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


class Venta extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productos: [],
            brand: "Ford",
            model: "Mustang",
            color: "red",
            year: 1964,
            enventa: [],
            inputSell: "",
            inventario:[]
        };

        this._onKeyPress = this._onKeyPress.bind(this);
        this._onChange = this._onChange.bind(this);
        this.getAllenventa = this.getAllenventa.bind(this);
        this.getAllinventario = this.getAllinventario.bind(this);
    }

    componentDidMount() {

        this.getAllenventa().then(data => {
            let array = Object.values(data);
            this.setState({
                enventa: array
            });
            console.log(this.state.enventa);

        })

        this.getAllinventario().then(data => {
            let array = Object.values(data);
            this.setState({
                inventario: array
            });
            console.log(this.state.inventario);

        })

    }

    async getAllenventa() {
        let allNotes = await dbenventa.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);

        return notes;
    };
    async getAllinventario() {
        let allNotes = await dbinventario.allDocs({ include_docs: true });
        let notes = {}
        allNotes.rows.forEach(n => notes[n.id] = n.doc);

        return notes;
    };


    _onKeyPress(event) {

        if (event.charCode === 13) { // enter key pressed
            let arregloProductos = this.state.productos

            let productoAgregado = {
                codigo: this.state.inputSell,
                nombre: "Naproxeno",
                precio: 1,
                cantidad: 1
            }
            arregloProductos.push(productoAgregado);
            var reverse = arregloProductos.reverse();
            var numero = this.state.number + 1;

            this.setState({ productos: reverse, inputSell: "" })

        }
    }

    _onChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
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
                            <TextField name={"inputSell"} onChange={this._onChange} onKeyPress={this._onKeyPress} id="outlined-basic" variant="outlined" value={this.state.inputSell} style={{ width: "100%", marginTop: "50px" }} />
                            <List>

                                <Paper style={{ overflow: 'auto', height: '55vh', marginTop: "30px" }}>

                                    <div >

                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="right">#</TableCell>
                                                    <TableCell align="right">Cantidad</TableCell>
                                                    <TableCell align="right">Producto</TableCell>
                                                    <TableCell align="right">Precio</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {this.state.productos.map((producto, index, key) => {


                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell align="right">{index + 1}</TableCell>
                                                            <TableCell align="right">{"2"}</TableCell>
                                                            <TableCell align="right">{producto.nombre}<br />{producto.codigo}</TableCell>
                                                            <TableCell align="right">{"$2.00"}</TableCell>
                                                            <TableCell align="right">{"$4.00"}</TableCell>
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
                    <Typography align="center" component="div" style={{ backgroundColor: '#bbbbbb', height: '100%' }}>
                        okok
        </Typography>
                </Grid>
            </Grid>
        );
    }
}

export default Venta;