import { Toaster } from "react-hot-toast";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import  Home  from './components/Home';
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" index element = {<Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App