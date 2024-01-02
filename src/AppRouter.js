import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import OrdersPage from "./pages/OrdersPage";
import ReviewsPage from "./pages/ReviewsPage";
import DeliveredPage from "./pages/DeliveredPage";

const publicRoutes = [
  { path: '/orders', element: OrdersPage },
  { path: '/reviews', element: ReviewsPage },
  { path: '/delivered', element: DeliveredPage },
  { path: '*', element: OrdersPage }
]

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Routes>
        {publicRoutes.map((route) => <Route path={route.path} element={<route.element />} />)}
      </Routes>
    </Suspense>
  )
}

export default AppRouter;