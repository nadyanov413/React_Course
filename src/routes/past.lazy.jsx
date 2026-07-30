import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getPastOders from '../api/getPastOrders';

export const Route = createLazyFileRoute('/past')({
  component: PastOrdersRoute, 
});

function PastOrdersRoute(){
  const [page, setPage] = useState(1);
  const { isLoading, data } = useQuery({
    queryKey: ['past-orders', page], 
    queryFn: () => getPastOders(page),
    staleTime: 30000
  });
  if(isLoading){
    return (
      <div classname="past-oders">
        <h2>LOADING...</h2>
      </div>
    );
  }

  return(
   <div classname="past-orders">
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Date</td>
          <td>Time</td>
        </tr>
      </thead>
      <tbody>
        {data.map((order) =>(
          <tr key={order.order_id}>
            <td>{order.order_id}</td>
            <td>{order.date}</td>
            <td>{order.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="pages">
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <button disabled={data.length < 10} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
   </div>
  )
}
