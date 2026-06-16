import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import MarketsPage from "@/pages/Markets";
import WatchlistPage from "@/pages/Watchlist";
import CommunityPage from "@/pages/Community";
import CryptoAIPage from "@/pages/CryptoAI";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/portfolio" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/markets" component={() => <ProtectedRoute component={MarketsPage} />} />
      <Route path="/watchlist" component={() => <ProtectedRoute component={WatchlistPage} />} />
      <Route path="/community" component={() => <ProtectedRoute component={CommunityPage} />} />
      <Route path="/crypto-ai" component={() => <ProtectedRoute component={CryptoAIPage} />} />
      <Route component={LoginPage} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </AuthProvider>
  );
}

export default App;
