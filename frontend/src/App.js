import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Layout from './components/Layout/Layout';
import Category from './components/Category/Category';
import About from './components/About/About';
import Help from './components/Help/Help';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Account from './components/Account/Account'; 
import Transaction from './components/Transaction/Transaction';

function App() {
  return (
    <AuthProvider>
      <Container fluid className="ps-0 pe-0">
        <Routes>
          <Route path="/" element={<Layout component={Transaction} />} />
          <Route path="/account" element={<Layout component={Account} />} />
          <Route path="/category" element={<Layout component={Category} />} />
          <Route path="/transaction" element={<Layout component={Transaction} />} />
          <Route path="/about" element={<Layout component={About} />} />
          <Route path="/help" element={<Layout component={Help} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </AuthProvider>
  );
}

export default App;
