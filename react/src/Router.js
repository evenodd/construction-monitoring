import React from "react";
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import Header from "./Header";
import SiteModels from './siteModel/SiteModels';
import SiteModelAdd  from './siteModel/SiteModelAdd';
import SiteModelMap from './siteModel/SiteModelMap';
import RoomAdd from './room/RoomAdd';
import RoomPage from './room/RoomPage';
import JobAdd from './job/JobAdd';
import MonitoringNodesPage from "./monitoringNodes/MonitoringNodesPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Header/>
            <Switch>
                <Route path="/app/siteModels/add">
                    <SiteModelAdd/>
                </Route>
                <Route path="/app/siteModels/:siteModelId/addRoom" component={RoomAdd}/>
                <Route path="/app/siteModels/:siteModelId/room/:roomId/addJob" component={JobAdd}/>
                <Route path="/app/siteModels/:siteModelId/room/:id" component={RoomPage}/>
                <Route path="/app/siteModels/:id/map" component={SiteModelMap}/>
                <Route path="/app/siteModels">
                    <SiteModels/>
                </Route>

                <Route path="/app/monitoringNodes" component={MonitoringNodesPage}/>
                
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
