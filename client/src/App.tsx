import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import AuthProvider from "./context/AuthContext";


function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/dashboard" Component={Dashboard}/>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
