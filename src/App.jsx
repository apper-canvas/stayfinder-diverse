import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import Destinations from "@/components/pages/Destinations";
import Deals from "@/components/pages/Deals";
import Help from "@/components/pages/Help";
import HotelDetails from "@/components/pages/HotelDetails";
import BookingConfirmationPage from "@/components/pages/BookingConfirmationPage";
function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
<Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/help" element={<Help />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/booking/:confirmationNumber" element={<BookingConfirmationPage />} />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </div>
  );
}

export default App;