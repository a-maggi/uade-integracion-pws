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
import MaterialTable, { MTableToolbar } from 'material-table';
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

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
  root: {
    padding: 10, paddingLeft: 25,
    flexGrow: 1,
  },
});


const formatData = (raw) => {
  let data = [];
  raw.forEach(e => {
    if (!e || e === "") return;
    let employee = data.find(x => x.taxNumber === e.employee.taxNumber);
    if (employee == undefined) {
      data.push({
        firstName: e.employee.firstName,
        lastName: e.employee.lastName,
        taxNumber: e.employee.taxNumber,
        hoursPerMonth: e.employee.hoursPerMonth,
        hoursInCompany: 0
      })
      employee = data.find(x => x.taxNumber === e.employee.taxNumber);
    }
    employee.hoursInCompany += e.hoursInCompany;

  })
  return data;
}

export default () => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(true);
  const [employeeRow, setEmployee] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [state, setState] = React.useState({
    columns: [
      { title: 'Nombre', field: 'firstName' },
      { title: 'Apellido', field: 'lastName' },
      { title: 'Horas a cumplir', field: 'hoursPerMonth', type: 'numeric' },
      { title: 'Horas cumplidas', field: 'hoursInCompany', type: 'numeric' }
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
        setEmployee(res);
      })
      .catch(err => {
        setMessageError(err)
      });

    await DashboardService.fetchHours()
      .then(res => {
        console.log("res", res);
        const rows = formatData(res);
        console.log("rows", rows);
        setState(
          {
            ...state,
            "data": rows
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
            nRowsSelected: '{0} empleado(s) seleccionados'
          },
          header: {
            actions: 'Acciones'
          },
          body: {
            emptyDataSourceMessage: 'Sin empleados a mostrar',
            editRow: { deleteText: '¿Estás seguro de eliminar este empleado?' },
            filterRow: {
              filterTooltip: 'Filtrar'
            }
          }
        }}
        components={{
          Toolbar: props => (
            <div>
              <MTableToolbar {...props} />
              <Grid container className={classes.root} spacing={2}>
                <Grid item xs={4}>
                  <Autocomplete
                    id="combo-box-demo"
                    options={employeeRow}
                    getOptionLabel={(option) => option.lastName + ", " + option.firstName}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Empleado" variant="outlined" />}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id="datetime-local"
                    label="Fecha desde"
                    type="datetime-local"
                    defaultValue="2020-07-01T00:00"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id="datetime-local"
                    label="Fecha hasta"
                    type="datetime-local"
                    defaultValue="2020-07-30T23:59"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          )
        }}
        icons={tableIcons}
        title="Horas trabajadas"
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }, 600);
            }),
        }}
      />
    </React.Fragment>
  );
}