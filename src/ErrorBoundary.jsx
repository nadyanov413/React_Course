import { Component } from "react";


class ExtraBoundary extends Component {
    state = { hasError: false}
    constructor(props){
        super(props);
    }
    static getDerivedStateFromError(){
        return { hasError: true}
    }


    render (){
    if(this.state.hasError){
        return (
            <div className="error-boundary">
                <h2> Uh oh!</h2>
                <p>
                    There was an error with this page. <Link to="/">Click here</Link> to go back to home page
                </p>
            </div>
        )
    }
    return this.props.children;
  }
}

export default ErrorBoundary;


<ErrorBoundary>
    <h1>hi</h1>
</ErrorBoundary>