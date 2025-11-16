import AppRoutes from "./routes/AppRoutes";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
