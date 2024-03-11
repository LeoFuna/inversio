
const MOCKED_TRADES = [
  { code: 'ITSA4', price: 10.00, quantity: 100, date: '10/10/2021', result: 1000.00 },
  { code: 'ITSA4', price: 10.00, quantity: 100, date: '10/10/2021', result: 1000.00 },
  { code: 'ITSA4', price: 10.00, quantity: 100, date: '10/10/2021', result: 1000.00 },
  { code: 'ITSA4', price: 10.00, quantity: 100, date: '10/10/2021', result: 1000.00 },
  { code: 'ITSA4', price: 10.00, quantity: 100, date: '10/10/2021', result: 1000.00 },
  { code: 'ITSA4', price: 10.00, quantity: 100, date: '10/10/2021', result: 1000.00 },
]

export default function TradesPage() {
  return (
    <main>
      <h1>Trades</h1>
      <div>
        <button>Inserir Trade</button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <td>Código</td>
              <td>Preço</td>
              <td>Quantidade</td>
              <td>Data</td>
              <td>Resultado</td>
            </tr>
          </thead>
          <tbody>
            {MOCKED_TRADES.map((trade, index) => (
              <tr key={index}>
                <td>{trade.code}</td>
                <td>{trade.price}</td>
                <td>{trade.quantity}</td>
                <td>{trade.date}</td>
                <td>R$ {trade.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}