import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayouts";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";




export function Router(){

    return(
        <BrowserRouter>
            <Routes>
                <Route element= {<AuthLayout />} >
                    <Route path="/" element={<RegisterView />} />
                    <Route path="/auth/login" element={<LoginView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}





