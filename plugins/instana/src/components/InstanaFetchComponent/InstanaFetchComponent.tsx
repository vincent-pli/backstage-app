import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableColumn, Progress, InfoCard } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { Typography, Grid, CardContent, Chip } from '@material-ui/core';
import { CompareArrowsOutlined } from '@material-ui/icons';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type Service = {
  id: string;
  label: string;
  types: string[];
  technologies: string[];
  calls: string;
  erroneousCalls: string;
  latency: string;
};

type DenseTableProps = {
  services: Service[];
};

export const DenseTable = ({ services }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Name', field: 'name' },
    { title: 'Types', field: 'types' },
    { title: 'Technologies', field: 'technologies' },
    { title: 'Calls', field: 'calls' },
    { title: 'ErroneousCalls', field: 'erroneousCalls' },
    { title: 'Latency', field: 'latency' },
  ];

  const data = services.map(service => {
    return {
      name: service.label,
      types: (
        service.types.map((type, index) => {
          return (
            <Chip key={index}
              label={type}
            />
          )
        })
      ),
      technologies: (
        service.technologies.map((technology, index) => {
          return (
            <Chip key={index}
              label={technology}
            />
          )
        })
      ),
      calls: service.calls,
      erroneousCalls: service.erroneousCalls,
      latency: service.latency,
    };
  });

  return (
    <Table
      title="Service List"
      options={{ search: true, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

const mergeServiceData = (serviceList, serviceMetrics) => {
  let services = []
  serviceList["items"].map(item => {
    let data = {}
    data["id"] = item["id"]
    data["label"] = item["label"]
    data["types"] = item["types"]
    data["technologies"] = item["technologies"]
    let metric = serviceMetrics["items"].filter(obj => {
      return obj["name"] === item["label"]
    })

    data["calls"] = metric[0]["metrics"]["calls.sum"][0][1]
    data["erroneousCalls"] = metric[0]["metrics"]["erroneousCalls.sum"][0][1]
    data["latency"] = metric[0]["metrics"]["latency.p90"][0][1]
    services.push(data)
  })


  return services
}

const getServiceMetrics = async () => {
  const payload = {
    "timeFrame": {
      "windowSize": 3600000,
      "to": Date.now()
    },
    "group": {
      "groupbyTag": "service.name"
    },
    "tagFilterExpression": {
      "type": "EXPRESSION",
      "logicalOperator": "AND",
      "elements": [
        {
          "type": "TAG_FILTER",
          "name": "application.name",
          "operator": "EQUALS",
          "entity": "DESTINATION",
          "value": "KTs"
        }
      ]
    },
    "metrics": [
      {
        "metric": "erroneousCalls",
        "granularity": 0,
        "aggregation": "SUM"
      },
      {
        "metric": "calls",
        "granularity": 0,
        "aggregation": "SUM"
      },
      {
        "metric": "latency",
        "granularity": 0,
        "aggregation": "P90"
      }
    ]
  }
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: 'apiToken YXW72SlLQoS6kLsO5M-EPA',

    },
    body: JSON.stringify(payload)
  };
  try {
    const fetchResponse = await fetch(`https://ibmdevsandbox-instanaibm.instana.io/api/application-monitoring/analyze/call-groups`, settings);
    const data = await fetchResponse.json();
    return data
  } catch (e) {
    return e;
  }

};


export const InstanaFetchComponent = () => {
  const applicationName = "KTs"
  const { value, loading, error } = useAsync(async (): Promise<Service[]> => {
    let settings = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'apiToken YXW72SlLQoS6kLsO5M-EPA',
      }
    };
    let response = await fetch('https://ibmdevsandbox-instanaibm.instana.io/api/application-monitoring/applications?nameFilter=' + applicationName, settings);
    const data = await response.json();
    let serviceLink = data["items"][0]["_links"]["services"]
    let responseServices = await fetch(serviceLink, settings);
    let services = await responseServices.json();
    
    let metrics = await getServiceMetrics()
    let result = mergeServiceData(services, metrics)
    return result;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <DenseTable services={value || []} />;
};
