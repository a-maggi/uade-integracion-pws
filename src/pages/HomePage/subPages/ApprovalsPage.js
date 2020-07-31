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

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


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


const tableIcons = {
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ViewColumn: React.forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


export default () => {
  const classes = useStyles();
  const [isLoaded, setLoaded] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [messageError, setMessageError] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);

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
      { title: 'Concepto', field: 'type', render: rowData => (rowData.type) } /*signed => update Modificaicon fichada */
    ],
    data: [],
  });

  const onReject = async (data) => {
    await DashboardService.rejectHours({ id: data._id })
      .then(res => {
        setSuccessMessage(true)
        fetch();
      })
      .catch(err => {
        setErrorMessage(true);
      });
  }

  const onApproved = async (data) => {
    await DashboardService.approvedHours({ id: data._id })
      .then(res => {
        setSuccessMessage(true)
        fetch();
      })
      .catch(err => {
        setErrorMessage(true);
      });
  }


  React.useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchHours("toApprove")
      .then(res => {
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
      icons={tableIcons}
      title="Aprobaciones"
      columns={state.columns}
      data={state.data}
      actions={[
        {
          icon: () => <ThumbDown></ThumbDown>,
          tooltip: 'Rechazar',
          onClick: (event, rowData) => onReject(rowData)
        },
        {
          icon: () => <ThumbUp></ThumbUp>,
          tooltip: 'Aprobar',
          onClick: (event, rowData) => onApproved(rowData)
        }
      ]}
    />

    <Snackbar open={successMessage} autoHideDuration={6000}>
      <Alert severity="success">
        Operación realizada con exito
      </Alert>
    </Snackbar>
    <Snackbar open={errorMessage} autoHideDuration={6000}>
      <Alert severity="error">
       Se produjo un error, intente nuevamente
      </Alert>
    </Snackbar>
    
    </React.Fragment>

  );
}