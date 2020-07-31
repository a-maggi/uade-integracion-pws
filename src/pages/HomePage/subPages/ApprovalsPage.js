import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DashboardService } from '../../../services/Dashboard';
import MaterialTable from 'material-table';
import { format, compareAsc } from 'date-fns'
const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));


export default () => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [messageError, setMessageError] = React.useState(false);
  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Entrada', field: 'entrySignedDatetime', type: 'datetime', render: rowData => {
          if (rowData.entry)
            return (format(new Date(rowData.entry.signedDatetime.replace('Z', '')), 'MM/dd/yyyy H:mm'))
          else
            return (format(new Date(rowData.newProposalEntryDatetime.replace('Z', '')), 'MM/dd/yyyy H:mm'))
        }
      },
      {
        title: 'Salida', field: 'egressSignedDatetime', type: 'datetime', render: rowData => {
          if (rowData.egress)
            return (format(new Date(rowData.egress.signedDatetime.replace('Z', '')), 'MM/dd/yyyy H:mm'))
          else
            return (format(new Date(rowData.newProposalEgressDatetime.replace('Z', '')), 'MM/dd/yyyy H:mm'))
        }
      },
      { title: 'Nombre', field: 'firstName', render: rowData => (rowData.employee.firstName) },
      { title: 'Apellido', field: 'lastName', render: rowData => (rowData.employee.lastName) },
      { title: 'Horas laburadas', field: 'hoursInCompany', render: rowData => (Math.round(rowData.hoursInCompany / 60 * 100) / 100 + ' hs') }
    ],
    data: [],
  });


  React.useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchHours()
      .then(res => {
        console.log(123);

      })
      .catch(err => {
        setMessageError(err)
      });
    setLoaded(false);
  }

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Fichadas para Aprobar
      </Typography>
      </Toolbar>

      <MaterialTable
        // other props
        isLoading={isLoaded}
        localization={{
          pagination: {
            labelRowsSelect: "registros",
            labelDisplayedRows: '{from}-{to} de {count}'
          },
          header: {
            actions: 'Accion'
          },
          body: {
            emptyDataSourceMessage: 'Sin registros a mostrar',
            editRow: { deleteText: 'Estas seguro de eliminar este registro?' },
            filterRow: {
              filterTooltip: 'Filtrar'
            }
          }
        }}
        title="Fichadas"
        columns={state.columns}
        data={state.data}
        actions={[
          {
            icon: "12",
            tooltip: 'Modificar fichada',
            onClick: (event, rowData) =>  alert(1)
          }
        ]}
      />


      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Nombre</TableCell>
              <TableCell align="right">Apellido</TableCell>
              <TableCell align="right">Fecha de ingreso</TableCell>
              <TableCell align="right">Fecha de salida</TableCell>
              <TableCell align="right">Fecha de salida</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}