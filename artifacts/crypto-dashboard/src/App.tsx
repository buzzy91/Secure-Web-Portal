import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { TransactionProvider } from "@/context/TransactionContext";
import { WithdrawalProvider } from "@/context/WithdrawalContext";
import { Toaster } from "sonner";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import MarketsPage from "@/pages/Markets";
import WatchlistPage from "@/pages/Watchlist";
import CommunityPage from "@/pages/Community";
import CryptoAIPage from "@/pages/CryptoAI";
import CoinDetailPage from "@/pages/CoinDetail";
import TransactionsPage from "@/pages/Transactions";
import RecoveryPage from "@/pages/Recovery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 15_000, refetchInterval: 30_000, retry: 2 },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  if (!isAuthenticated) { navigate("/"); return null; }
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
      <Route path="/coin/:id" component={() => <ProtectedRoute component={CoinDetailPage} />} />
      <Route path="/transactions" component={() => <ProtectedRoute component={TransactionsPage} />} />
      <Route path="/recovery" component={() => <ProtectedRoute component={RecoveryPage} />} />
      <Route component={LoginPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TransactionProvider>
          <WithdrawalProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster position="top-center" theme="dark" richColors />
          </WithdrawalProvider>
        </TransactionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
