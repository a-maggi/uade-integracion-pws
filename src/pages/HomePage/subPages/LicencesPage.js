import React from 'react';
import clsx from 'clsx';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
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
import moment from 'moment'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Add } from '@material-ui/icons';
import Select from '@material-ui/core/Select';

import InputLabel from '@material-ui/core/InputLabel';
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
  const [openModal, setOpenModal] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formData, updateFormData] = React.useState({
    entrySignedDatetime: "",
    egressSignedDatetime: "",
    justified: "",
    id: "",
    type: ""
  });
  const [state, setState] = React.useState({
    columns: [
      {
        title: 'Fecha de inicio', field: 'entrySignedDatetime', type: 'datetime', render: rowData => (format(new Date(rowData.newProposalEntryDatetime.replace('Z', '')), 'MM/dd/yyyy'))
      },
      {
        title: 'Fecha de fin', field: 'egressSignedDatetime', type: 'datetime', render: rowData => (format(new Date(rowData.newProposalEgressDatetime.replace('Z', '')), 'MM/dd/yyyy'))
      },
      {
        title: 'Tipo', field: 'type', render: rowData => {
          switch (rowData.type) {
            case "holiday":
              return "Vacaciones";
            case "study":
              return "Dia de estudio";
            default:
              return "Licencia"
          }
        }
      },
      {
        title: 'Cantidad de dias', field: 'hoursInCompany', render: rowData => {
          var fromDay = moment(new Date(rowData.newProposalEntryDatetime.replace('Z', '')));
          var toDay = moment(new Date(rowData.newProposalEgressDatetime.replace('Z', '')));
          return toDay.diff(fromDay, 'days')+1
        }
      },
      {
        title: 'Estado', field: 'approved', render: rowData => {
          if(rowData.approved)
            return 'Aprobada';
          else
            return 'Pendiente'
        }
      },
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
    setSuccess(false);
    setError(false);
  };

  /* Nueva fichada */


  const onOpenModal = (data) => {
    setOpenModal(!openModal);
  }
  const onCloseModal = () => {
    updateFormData({
      entrySignedDatetime: "",
      egressSignedDatetime: "",
      justified: "",
      id: "",
    })
    setOpenModal(false);
  }

  const onSubmit = async () => {
    await DashboardService.createHours({ ...formData, approved: false })
      .then(res => {
        setSuccess(true);
        setOpenModal(false);
        fetch();
      })
      .catch(err => {
        setError(true);
      });
  }

  /* Nueva licencia */



  const fetch = async () => {
    setLoaded(true);
    await DashboardService.fetchHours('licence')
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
  const id = openModal ? 'scroll-playground' : null;
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
          },
          header: {
            actions: 'Accion'
          },
          body: {
            emptyDataSourceMessage: 'Sin licencias aprobadas',
            filterRow: {
              filterTooltip: 'Filtrar'
            }
          }
        }}
        icons={tableIcons}
        title="Licencias"
        columns={state.columns}
        data={state.data}
        actions={[
          {
            icon: () => <Add></Add>,
            tooltip: 'Agregar licencia',
            isFreeAction: true,
            onClick: (event) => onOpenModal()
          }
        ]}
      />

      <Modal
        open={openModal}
        onClose={onCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <Paper className={classes.paper}>
          <DialogTitle>Solicitar nueva licencia</DialogTitle>
          <DialogContent>
            <TextField
              id="date"
              label="Fecha desde"
              type="date"
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
              label="Fecha hasta"
              type="date"
              name="egressSignedDatetime"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            />
            <FormControl className={classes.margin} fullWidth>
              <InputLabel id="demo-simple-select-label">Tipo de licencia</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="type"
                onChange={handleChange}
              >
                <MenuItem value="holiday">Vacaciones</MenuItem>
                <MenuItem value="study">Dia de estudio</MenuItem>
              </Select>
            </FormControl>
            <DialogContentText>Su solicitud sera enviada al departamento de <br></br> RRHH para su analisis y posible aprobación.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseModal}>Cancelar</Button>
            <Button onClick={onSubmit}>Confirmar</Button>
          </DialogActions>
        </Paper>
      </Modal>

      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          Licencia solicitada con exito.
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error">
          La licencia no se pudo generar.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}