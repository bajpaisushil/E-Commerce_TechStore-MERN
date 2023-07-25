import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/navbar';
import HomePage from './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';
import { useDispatch, useSelector } from 'react-redux';
import NewProduct from './pages/newProduct';
import ProductPage from './pages/productPage';
import CategoryPage from './pages/categoryPage';
import ScrollToTop from './components/scrollToTop';
import CartPage from './pages/cartPage';
import OrdersPage from './pages/ordersPage';
import AdminDashboard from './pages/adminDashboard';
import EditProductPage from './pages/editProductPage';
import { useEffect } from 'react';
import {io} from 'socket.io-client';
import { addNotification } from './features/userSlice';
import Home from './pages/home';

function App() {
  const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const socket = io("ws://localhost:8000");
        socket.off("notification").on("notification", (msgObj, user_id) => {
            // logic for notification
            if (user_id === user._id) {
                dispatch(addNotification(msgObj));
            }
        });

        socket.off("new-order").on("new-order", (msgObj) => {
            if (user.isAdmin) {
                dispatch(addNotification(msgObj));
            }
        });
    }, []);
    return (
        <div className="App">
            <BrowserRouter>
                <ScrollToTop />
                <Navigation />
                <Routes>
                    <Route index element={<Home />} />
                    {!user && (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </>
                    )}

                    {user && (
                        <>
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                        </>
                    )}
                    {user && user.isAdmin && (
                        <>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/product/:id/edit" element={<EditProductPage />} />
                        </>
                    )}
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />

                    <Route path="/new-product" element={<NewProduct />} />

                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
