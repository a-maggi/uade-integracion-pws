import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Title from './Title';
import { format, subWeeks } from 'date-fns'
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DashboardService } from '../services/Dashboard';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';

function createData(time, amount) {
  return { time, amount };
}

export default function Chart() {
  const theme = useTheme();

  const [isLoaded, setLoaded] = React.useState(true);
  const [messageError, setMessageError] = React.useState(false);
  const [dataGraph, setData] = React.useState(null);

  const formatData = (raw) => {
    let data = [];
    raw.forEach(e => {
      if (!e || e === "") return;
      let hoursforDate = data.find(x => x.date === format(new Date(e.createdAt), "dd"));
      if (hoursforDate == undefined) {
        data.push({
          date: format(new Date(e.createdAt), "dd"),
          hours: e.hoursInCompany
        })
        hoursforDate = data.find(x => x.date === format(new Date(e.createdAt), "dd"));
      }
      hoursforDate.hours += e.hoursInCompany
    })
    return data;
  }

  React.useEffect(() => {
    fetch();
  }, []);


  const fetch = async () => {
    setLoaded(true);
    await fetchHours();
    setLoaded(false);
  }

  const fetchHours = async () => {
    await DashboardService.fetchHours({
      employee: '',
      dateFrom: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      dateTo: format(new Date(), "yyyy-MM-dd")
    })
      .then(res => {
        console.log(res)
        const rows = formatData(res);
        const maps = rows.map((e) => (createData(e.date, Math.round(e.hours / 60  * 100)/100)));
        setData(maps);

      })
      .catch(err => {
        setMessageError(err)
      });
  }

  return (
    <React.Fragment>
      <Title>Esta semana</Title>
      <ResponsiveContainer width="100%" height={150} minWidth="0">
        {isLoaded ?
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
          ><CircularProgress size={24} /></Grid> :
          
            dataGraph ?
          
          <LineChart
            data={dataGraph}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary}>
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
              >
                Horas
          </Label>
            </YAxis>
            <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
          </LineChart> : <div>No hay registros</div>
        }
      </ResponsiveContainer>
    </React.Fragment>
  );
}