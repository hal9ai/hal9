/**
  input: [ ]
  output: [ data ]
  params:    
    - name: key
      label: 'API Key'
      value:
        - control: 'textbox'     

    - name: limit
      label: 'Limit '
      value:
        - control: 'number'     

    - name: stock
      label: 'Stock Name '
      value:
        - control: 'textbox'     

    - name: anqu
      label: 'Annual/Quarter'
      value:
        - control: 'select'
          value: ''
          values:
            - name: ann
              label: Annual
            - name: quar
              label: Quarterly


    - name: api
      label: 'Service to fetch'
      value:
        - control: 'select'
          value: ''
          values:
            - name: is
              label: Income Statement
            - name: cfs
              label: Cash Flow Statement 
            - name: bss
              label: Balance Sheet Statement            
            - name: isar
              label: Income Statements as reported
            - name: bssar
              label: Balance Sheet Statement as reported
            - name: cfsar
              label: Cash Flow Statement as reported
            - name: ffsar
              label: Full Financial Statement as reported
            - name: cseti
              label: Canadian Stock Exchange TSX (SEDAR) income
            - name: eis
              label: Euronext income statements    
            - name: xgis
              label: XETRA (Bundesanzeiger) Germany income statements
            - name: nseois
              label: National Stock Exchange of India income statements
            - name: lseis
              label: London Stock Exchange (Companies house) income statements 
            - name: meis
              label: Moscow Exchange (MOEX) income statements
            - name: hheis
              label: Hong Kong Exchange (SEHK) income statements
            - name: aseis
              label: Australian Stock Exchange (ASX) income statements
            - name: nseis
              label: Norway stock exchange (OSE) income statements
            - name: seis
              label: Swiss Exchange (SIX) income statements
            - name: isg
              label: Income statements growth
            - name: absg
              label: Annual balance sheet growth
            - name: acfsg
              label: Annual cash flow statements growth
            - name: ckm
              label: Company Key Metrics
            - name: cfgg
              label: Company Financial Growth
            - name: ouapi
              label: Optional URL API 
            
    - name: urlopt
      label: 'API URL( optional ) '
      value:
        - control: 'textbox'     



  deps:
    - https://apis.google.com/js/client.js
    - https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
    - https://cdn.jsdelivr.net/npm/apache-arrow@latest
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

let url = '';

if (api == 'is') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/income-statement/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/income-statement/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'cfs') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${stock}?apikey=${key}&limit=${limit}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'bss') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'isar') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/income-statement-as-reported/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/income-statement-as-reported/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'bssar') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement-as-reported/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement-as-reported/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'cfsar') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/cash-flow-statement-as-reported/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/cash-flow-statement-as-reported/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'ffsar') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/financial-statement-full-as-reported/${stock}?apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/financial-statement-full-as-reported/${stock}?period=quarter&apikey=${key}`;
  }
}
else if (api == 'cseti') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/RY.TO?limit=${limit}&apikey=${key}`;
}
else if (api == 'eis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/EDF.PA?limit=${limit}&apikey=${key}`;
}
else if (api == 'xgis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/SAP.DE?limit=${limit}&apikey=${key}`;
}
else if (api == 'nseois') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/RELIANCE.NS?limit=${limit}&apikey=${key}`;
}
else if (api == 'lseis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/GLEN.L?limit=${limit}&apikey=${key}`;
}
else if (api == 'meis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/GAZP.ME?limit=${limit}&apikey=${key}`;
}
else if (api == 'hheis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/1797.HK?limit=${limit}&apikey=${key}`;
}
else if (api == 'aseis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/APT.AX?limit=${limit}&apikey=${key}`;
}
else if (api == 'nseis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/BON.OL?limit=${limit}&apikey=${key}`;
}
else if (api == 'seis') {
  url = `https://financialmodelingprep.com/api/v3/income-statement/FHZN.SW?limit=${limit}&apikey=${key}`;
}
else if (api == 'isg') {
  url = `https://financialmodelingprep.com/api/v3/income-statement-growth/${stock}?limit=${limit}&apikey=${key}`;
}
else if (api == 'absg') {
  url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement-growth/${stock}?limit=${limit}&apikey=${key}`;
}
else if (api == 'acfsg') {
  url = `https://financialmodelingprep.com/api/v3/cash-flow-statement-growth/${stock}?limit=${limit}&apikey=${key}`;
}
else if (api == 'ckm') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/key-metrics/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/key-metrics/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'cfgg') {
  if (anqu == 'ann') {
    url = `https://financialmodelingprep.com/api/v3/financial-growth/${stock}?limit=${limit}&apikey=${key}`;
  }
  else if (anqu == 'quar') {
    url = `https://financialmodelingprep.com/api/v3/financial-growth/${stock}?period=quarter&limit=${limit}&apikey=${key}`;
  }
}
else if (api == 'ouapi') {
  url = urlopt;
}

data = await fetch(url, {
  method: 'GET'
}).then(res => res.json());
data = aq.from(data);
