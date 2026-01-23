import { Toaster } from "react-hot-toast";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import  Home  from './components/Home';
import User from './components/User';
import Admin from './components/Admin/Admin';
import Teacher from './components/Teacher';
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" index element = {<Home/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/user" element = {<User/>}/>
          <Route path="/teacher" element ={<Teacher/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App