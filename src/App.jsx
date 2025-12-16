import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';
// Pages will be created next
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Stock from './pages/Stock';
import Transactions from './pages/Transactions';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/stock" element={<Stock />} />
                            <Route path="/transactions" element={<Transactions />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
