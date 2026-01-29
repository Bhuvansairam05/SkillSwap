import { Toaster } from "react-hot-toast";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import  Home  from './components/Home';
import UserDashboard from './components/User/UserDashboard';
import Admin from './components/Admin/Admin';
function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" index element = {<Home/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/user" element = {<UserDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App