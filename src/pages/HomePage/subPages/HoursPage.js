import React from 'react';
import clsx from 'clsx';
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
import { format, compareAsc } from 'date-fns'
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Add } from '@material-ui/icons';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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


const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  margin: {
    marginBottom: theme.spacing(5),
  },
  textField: {
    display: 'block',
  },
}));

//revision: false O revision true approbed true

export default () => {
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const [isLoaded, setLoaded] = React.useState(true);
  const [employeeRow, setEmployee] = React.useState(false);
  const [openChange, setOpenChange] = React.useState(false);
  const [openNew, setOpenNew] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [errorChange, setErrorChange] = React.useState(false);
  const [successChange, setSuccessChange] = React.useState(false);
  const [errorNew, setErrorNew] = React.useState(false);
  const [successNew, setSuccessNew] = React.useState(false);
  const [formData, updateFormData] = React.useState({
    entrySignedDatetime: "",
    egressSignedDatetime: "",
    justified: "",
    id: ""
  });
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

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessChange(false);
  };
  const handleCloseAlertError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorChange(false);
  };

  const onOpenModalChange = (data) => {
    updateFormData({
      entrySignedDatetime: data.entry? data.entry.signedDatetime:data.newProposalEntryDatetime,
      egressSignedDatetime: data.egress? data.egress.signedDatetime:data.newProposalEgressDatetime,
      justified: "",
      id: data._id
    });
    setOpenChange(!openChange);
  }
  const onCloseModalChage = () => {
    updateFormData({
      entrySignedDatetime: "",
      egressSignedDatetime: "",
      justified: "",
      id: "",
    })

    setOpenChange(false);
  }

  const onSubmitChange = async () => {
    await DashboardService.modifyHours({ ...formData, approved: false })
      .then(res => {
        setSuccessChange(true)
        setOpenChange(false);
        fetch();
      })
      .catch(err => {
        setErrorChange(true);
      });
  }


  /* Nueva fichada */

  const handleCloseAlertNew = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessNew(false);
  };
  const handleCloseAlertErrorNew = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorNew(false);
  };

  const onOpenModalNew = (data) => {
    setOpenNew(!openChange);
  }
  const onCloseModalNew = () => {
    updateFormData({
      entrySignedDatetime: "",
      egressSignedDatetime: "",
      justified: "",
      id: "",
    })
    setOpenNew(false);
  }

  const onSubmitNew = async () => {
    await DashboardService.createHours({ ...formData, approved: false, type: 'update' })
      .then(res => {
        setSuccessNew(true);
        setOpenNew(false);
        fetch();
      })
      .catch(err => {
        setErrorNew(true);
      });
  }
  /* Nueva fichada */



  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchHours('signed')
      .then(res => {
        console.log(123);
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
  const id = openChange ? 'scroll-playground' : null;
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
        title="Fichadas"
        columns={state.columns}
        data={state.data}
        actions={[
          {
            icon: () => <Edit></Edit>,
            tooltip: 'Modificar fichada',
            onClick: (event, rowData) => onOpenModalChange(rowData)
          },
          {
            icon: () => <Add></Add>,
            tooltip: 'Agregar fichada',
            isFreeAction: true,
            onClick: (event) => onOpenModalNew()
          }
        ]}
      />

      <Modal
        open={openChange}
        onClose={onCloseModalChage}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <Paper className={classes.paper}>
          <DialogTitle>Solicitar cambio de fichada</DialogTitle>
          <DialogContent>
            <TextField
              id="date"
              label="Fecha desde"
              type="datetime-local"
              name="entrySignedDatetime"
              defaultValue={formData.entrySignedDatetime.replace('Z', '')}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            />

            <TextField
              id="date"
              label="Fecha desde"
              type="datetime-local"
              name="egressSignedDatetime"
              defaultValue={formData.egressSignedDatetime.replace('Z', '')}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            />
            <TextField
              id="outlined-multiline-static"
              name="justified"
              label="Justificacion"
              multiline
              rows={4}
              defaultValue="Ingrese el motivo del pedido de cambio."
              variant="outlined"
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            />
            <DialogContentText>Su solicitud sera enviada al departamento de <br></br> RRHH para su analisis y posible aprobación.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseModalChage}>Cancelar</Button>
            <Button onClick={onSubmitChange}>Confirmar</Button>
          </DialogActions>
        </Paper>
      </Modal>
      
      <Snackbar open={successChange} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          Fichada actualizada.
        </Alert>
      </Snackbar>
      <Snackbar open={errorChange} autoHideDuration={6000} onClose={handleCloseAlertError}>
        <Alert onClose={handleCloseAlertError} severity="error">
          La fichada no se pudo actualizar.
        </Alert>
      </Snackbar>


      
      <Modal
        open={openNew}
        onClose={onCloseModalNew}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <Paper className={classes.paper}>
          <DialogTitle>Solicitar nueva fichada</DialogTitle>
          <DialogContent>
            <TextField
              id="date"
              label="Fecha desde"
              type="datetime-local"
              name="entrySignedDatetime"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            />
            <TextField
              id="date"
              label="Fecha desde"
              type="datetime-local"
              name="egressSignedDatetime"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            />
            <DialogContentText>Su solicitud sera enviada al departamento de <br></br> RRHH para su analisis y posible aprobación.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseModalNew}>Cancelar</Button>
            <Button onClick={onSubmitNew}>Confirmar</Button>
          </DialogActions>
        </Paper>
      </Modal>

      <Snackbar open={successNew} autoHideDuration={6000} onClose={handleCloseAlertNew}>
        <Alert onClose={handleCloseAlertNew} severity="success">
          Fichada generada.
        </Alert>
      </Snackbar>
      <Snackbar open={errorNew} autoHideDuration={6000} onClose={handleCloseAlertErrorNew}>
        <Alert onClose={handleCloseAlertErrorNew} severity="error">
          La fichada no se pudo generar.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}