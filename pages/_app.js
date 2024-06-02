import "@/styles/globals.css";
import { Provider } from "react-redux";
import PrivateRoute from "@/privateGuard/withAuth";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from "@/store/store";

export default function App({ Component }) {
  
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <PrivateRoute>
  <Component  />
  </PrivateRoute>
  </PersistGate>
  </Provider>
  )
}
