import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getPastOders from '../api/getPastOrders';
import getPastOrder from "../api/getPastOder";
import Modal from '../Modal';
import {priceConverter} from '../useCurrency';



export const Route = createLazyFileRoute('/past')({
  component: PastOrdersRoute, 
});

function PastOrdersRoute(){
  const [page, setPage] = useState(1);
  const { focusedOrder, setFocusedOrder} = useState();
  const { isLoading, data } = useQuery({
    queryKey: ['past-orders', page], 
    queryFn: () => getPastOders(page),
    staleTime: 30000
  });

   const {isLoading: isLoadingPastOrder, data: pastOrderData} = useQuery({
    queryKey: ["past=order", focusedOrder],
    queryFn: () => getPastOrder(focusedOrder),
    staleTime: 86400000,
    enabled: !!focusedOrder
   })

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
    {
      focusedOrder ? (
        <Modal>
          <h2>Order #{focusedOrder}</h2>
          {!isLoadingPastOrder ? (
            <table>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Name</td>
                  <td>Size</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td>Total</td>
                </tr>
              </thead>
              <tbody>
                {pastOrderData.orderItems.map((pizza) => (
                    <tr key={`${pizza.pizzaTypeId}`}>
                      <td></td>
                    </tr>
                ))}
              </tbody>
            </table>
          ): <p> Loading ...</p>}
        </Modal>
      ) : null
    }
   </div>
  )
}
