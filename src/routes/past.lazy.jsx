import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import getPastOders from '../api/getPastOrders';
import getPastOrder from "../api/getPastOrder";
import Modal from '../Modal';
import {priceConverter} from '../useCurrency';
import ErrorBoundary from '../ErrorBoundary';



export const Route = createLazyFileRoute('/past')({
  component: ErrorBoundaryWrappedPastOrderRoutes, 
});

function ErrorBoundaryWrappedPastOrderRoutes(props){
  return (
    <ErrorBoundary>
      <PastOrdersRoute {...props}/>
    </ErrorBoundary>
  )
}

function PastOrdersRoute(){
  throw new Error ("wtf");
  const [page, setPage] = useState(1);
  const [focusedOrder, setFocusedOrder] = useState();
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
            <td>
              <button onClick={() => setFocusedOrder(order.order_id)}>
              {order.order_id}
              </button>
            </td>
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
                      <td>
                        <img src={pizza.image} alt={pizza.className}/>
                      </td>
                      <td> {pizza.name}</td>
                      <td> {pizza.size}</td>
                      <td> {pizza.quantity}</td>
                      <td> {priceConverter(pizza.price)}</td>
                      <td> {priceConverter(pizza.total)}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          ): <p> Loading ...</p>}
          <button onClick={() => setFocusedOrder()}>Close</button>
        </Modal>
      ) : null
    }
   </div>
  )
}
