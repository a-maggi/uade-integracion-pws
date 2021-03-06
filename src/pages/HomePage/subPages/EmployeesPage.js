import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DashboardService } from '../../../services/Dashboard';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { format, parse } from 'date-fns'

const tableIcons = {
  Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: React.forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: React.forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


const StyledTableCell = withStyles((theme) => ({
  head: {
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});


export default () => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(true);
  const [employeeRow, setEmployee] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Nombre', field: 'firstName' },
      { title: 'Apellido', field: 'lastName' },
      { dateSetting: { locale: "es-AR"} ,title: 'Fecha ingreso',validate: rowData => moment(rowData.startDate, "YYYY-MM-DD", true).isValid(),  field: 'startDate' },
      { dateSetting: { locale: "es-AR"} ,title: 'Fecha salida',validate: rowData => rowData.endDate? moment(rowData.endDate, "YYYY-MM-DD", true).isValid() : true,  field: 'endDate' },
      { title: 'Documento', field: 'document', type: 'string' },
      { title: 'Cuil', field: 'taxNumber', type: 'string' },
      { title: 'Horas mensuales', field: 'hoursPerMonth', type: 'numeric' },
      { title: 'Horario inicio', field: 'jobStart', type: 'string', validate: rowData => moment(rowData.jobStart, "HH:mm", true).isValid()||moment(rowData.jobStart, "HH:mm:ss.SSS", true).isValid(),  render: rowData => 
        ( moment(rowData.jobStart, "HH:mm:ss.SSS", true).isValid() ? format(parse(rowData.jobStart,"HH:mm:ss.SSS", new Date()),"HH:mm") : rowData.jobStart ),
        editComponent: props => (<TextField inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", style: { fontSize: '13px' } }} value={moment(props.value, "HH:mm:ss.SSS", true).isValid()? format(parse(props.value,"HH:mm:ss.SSS", new Date()),"HH:mm"): props.value} size="small" onChange={(e) => props.onChange(e.target.value)} />)
      },
      { title: 'Horario fin', field: 'jobEnd', validate: rowData => moment(rowData.jobEnd, "HH:mm", true).isValid()||moment(rowData.jobEnd, "HH:mm:ss.SSS", true).isValid(),  render: rowData => 
      ( moment(rowData.jobEnd, "HH:mm:ss.SSS", true).isValid() ? format(parse(rowData.jobEnd,"HH:mm:ss.SSS", new Date()),"HH:mm") : rowData.jobEnd ),
      editComponent: props => (<TextField inputProps={{ pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", style: { fontSize: '13px' } }} value={moment(props.value, "HH:mm:ss.SSS", true).isValid()? format(parse(props.value,"HH:mm:ss.SSS", new Date()),"HH:mm"): props.value} size="small" onChange={(e) => props.onChange(e.target.value)} />)
      },
    ],
    data: [],
  });
  React.useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchEmployees()
      .then(res => {
        console.log(res);
        setEmployee(res);
        setState(
          {
            ...state,
            "data": res
          }
        )
      })
      .catch(err => {
        setMessageError(err)
      });
    setLoaded(false);
  }

  return (

    <React.Fragment>

      <MaterialTable
        // other props
        isLoading={isLoaded}
        localization={{
          pagination: {
            labelRowsSelect: "registros",
            labelDisplayedRows: '{from}-{to} de {count}'
          },
          toolbar: {
            searchPlaceholder: "Buscar..",
            nRowsSelected: '{0} empleado(s) seleccionados'
          },
          header: {
            actions: 'Acciones'
          },
          body: {
            emptyDataSourceMessage: 'Sin empleados a mostrar',
            editRow: { deleteText: 'Estas seguro de eliminar este empleado?' },
            filterRow: {
              filterTooltip: 'Filtrar'
            }
          }
        }}
        icons={tableIcons}
        title="Empleados"
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              DashboardService.createEmployee(newData)
                .then(res => {
                  resolve();
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data.push(res);
                    return { ...prevState, data };
                  });
                })
                .catch(err => {
                  resolve();
                  setMessageError(err)
                });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              console.log(oldData);
              DashboardService.modifyEmployee(newData)
                .then(res => {
                  resolve();
                  if (oldData) {
                    setState((prevState) => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = res;
                      return { ...prevState, data };
                    });
                  }
                })
                .catch(err => {
                  resolve();
                  setMessageError(err)
                });
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              DashboardService.removeEmployee(oldData)
                .then(res => {
                  resolve();
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                })
                .catch(err => {
                  resolve();
                  setMessageError(err)
                });
            }),
        }}
      />
    </React.Fragment>
  );
}