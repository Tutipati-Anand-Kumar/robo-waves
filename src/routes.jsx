import {createBrowserRouter} from "react-router-dom"
import Register from "./components/Register"

const routes = createBrowserRouter(
    [
        {
            path:"/",
            element:<Register></Register>
        }
    ]
)

export default routes