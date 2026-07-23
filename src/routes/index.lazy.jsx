import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index(){
    return (
        <div className='index'>
            <div className='index-brand'>
                <h1>Padre Gino's</h1>
                <p> Pizza location near you!</p>
            </div>
            <ul>
                <li>
                    <Link to="/order">Order</Link>
                </li>
                <li>
                    <Link to="/past">Past Order's</Link>
                </li>
            </ul>
        </div>
    )
}
