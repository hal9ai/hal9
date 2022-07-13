/**
  input: [ ]
  output: [ data ]
  params:
    - name: stock
      label: 'Stock Name'
      value:
        - control: 'textbox'
          value: 'MSFT'
          lazy: true
    - name: statistic
      label: 'Statistic to Fetch'
      value:
        - control: 'select'
          value: 'historicalPriceFull'
          values:
            - name: annualIncome
              label: Annual income statements
            - name: annualIncomeReported
              label: Annual income statements as reported
            - name: annualIncomeGrowth
              label: Annual income statements growth
            - name: quarterlyIncome
              label: Quarterly income statements
            - name: quarterlyIncomeReported
              label: Quarterly income statements as reported
            - name: annualBalance
              label: Annual balance sheet statements
            - name: annualBalanceReported
              label: Annual balance sheet statements as reported
            - name: annualBalanceGrowth
              label: Annual balance sheet statements growth
            - name: quarterlyBalance
              label: Quarterly balance sheet statements
            - name: quarterlyBalanceReported
              label: Quarterly balance sheet statements as reported
            - name: annualCash
              label: Annual cash flow statements
            - name: annualCashReported
              label: Annual cash flow statements as reported
            - name: annualCashGrowth
              label: Annual cash flow statements growth
            - name: quarterlyCash
              label: Quarterly cash flow statements
            - name: quarterlyCashReported
              label: Quarterly cash flow statements as reported
            - name: annualFullReported
              label: Annual full financial statement as reported
            - name: quarterlyFullReported
              label: Quarterly full financial statement as reported
            - name: historicalPriceFull
              label: Daily stock historical prices with change and volume
    - name: limit
      label: 'Limit Results'
      value:
        - control: 'number'
          value: 10
          lazy: true
    - name: apiKey
      label: 'API Key'
      value:
        - control: 'textbox'
          value: '9e3bc7683c9510385d246533a1e1c559'
          lazy: true
  deps:
    - https://cdn.jsdelivr.net/npm/arquero@latest
  cache: true
**/

// Data provided by Financial Modeling Prep
// https://financialmodelingprep.com/developer/docs/

const baseUrl = 'https://financialmodelingprep.com/api/v3';
let url;

switch (statistic) {
  case 'annualIncome':
    url = `${baseUrl}/income-statement/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualIncomeReported':
    url = `${baseUrl}/income-statement-as-reported/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualIncomeGrowth':
    url = `${baseUrl}/income-statement-growth/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'quarterlyIncome':
    url = `${baseUrl}/income-statement/${stock}?period=quarter&limit=${limit}&apikey=${apiKey}`;
    break;
  case 'quarterlyIncomeReported':
    url = `${baseUrl}/income-statement-as-reported/${stock}?period=quarter&limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualBalance':
    url = `${baseUrl}/balance-sheet-statement/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualBalanceReported':
    url = `${baseUrl}/balance-sheet-statement-as-reported/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualBalanceGrowth':
    url = `${baseUrl}/balance-sheet-statement-growth/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'quarterlyBalance':
    url = `${baseUrl}/balance-sheet-statement/${stock}?period=quarter&limit=${limit}&apikey=${apiKey}`;
    break;
  case 'quarterlyBalanceReported':
    url = `${baseUrl}/balance-sheet-statement-as-reported/${stock}?period=quarter&limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualCash':
    url = `${baseUrl}/cash-flow-statement/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualCashReported':
    url = `${baseUrl}/cash-flow-statement-as-reported/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualCashGrowth':
    url = `${baseUrl}/cash-flow-statement-growth/${stock}?limit=${limit}&apikey=${apiKey}`;
    break;
  case 'quarterlyCash':
    url = `${baseUrl}/cash-flow-statement/${stock}?period=quarter&limit=${limit}&apikey=${apiKey}`;
    break;
  case 'quarterlyCashReported':
    url = `${baseUrl}/cash-flow-statement-as-reported/${stock}?period=quarter&limit=${limit}&apikey=${apiKey}`;
    break;
  case 'annualFullReported':
    url = `${baseUrl}/financial-statement-full-as-reported/${stock}?apikey=${apiKey}`;
    break;
  case 'quarterlyFullReported':
    url = `${baseUrl}/financial-statement-full-as-reported/${stock}?period=quarter&apikey=${apiKey}`;
    break;
  case 'historicalPriceFull':
    url = `${baseUrl}/historical-price-full/${stock}?apikey=${apiKey}`;
    break;
  default:
    throw 'Requested statistic not recognized';
}

data = await fetch(url, {
  method: 'GET'
}).then(
  res => res.json()
);


data = aq.from(data);
