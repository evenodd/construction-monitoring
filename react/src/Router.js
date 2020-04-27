import React from "react";
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import Header from "./Header";
import SiteModel from './siteModel/SiteModels';
import SiteModelAdd  from './siteModel/SiteModelAdd';
export default function Router() {
    return (
        <BrowserRouter>
            <Header/>
            <Switch>
                <Route path="/app/siteModels/add">
                    <SiteModelAdd />
                </Route>

                <Route path="/app/siteModels">
                    <SiteModel />
                </Route>
                
                <Route exact path="/app">
                    <Home />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

// You can think of these components as "pages"
// in your app.

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}
