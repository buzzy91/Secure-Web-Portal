import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";

vi.mock("@/services/coingecko", () => ({
  getMarkets: vi.fn().mockResolvedValue([
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://example.com/bitcoin.png",
      current_price: 66500,
      market_cap: 1_300_000_000_000,
      market_cap_rank: 1,
      total_volume: 30_000_000_000,
      price_change_percentage_24h: 2.43,
      price_change_percentage_7d_in_currency: 4.2,
      circulating_supply: 19_000_000,
      sparkline_in_7d: { price: [65000, 66000, 66500] },
    },
  ]),
  getCoinChart: vi.fn().mockResolvedValue({
    prices: [
      [Date.now() - 86_400_000, 65000],
      [Date.now(), 66500],
    ],
  }),
  getCoinDetail: vi.fn(),
  getTrendingCoins: vi.fn().mockResolvedValue([]),
  fmt: (value: number) => `$${value.toLocaleString("en-US")}`,
  fmtPct: (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`,
}));

vi.mock("@/components/WelcomeModal", () => ({
  default: () => null,
}));

vi.mock("@/components/PerformanceChart", () => ({
  default: () => <div data-testid="performance-chart" />,
}));

const VALID_EMAIL = "bignickbls586@gmail.com";
const VALID_PASSWORD = "Nicholson29@5&";

function renderApp(path = "/") {
  window.history.pushState({}, "", path);
  return render(<App />);
}

async function submitLogin(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
) {
  await user.type(screen.getByPlaceholderText("Enter your email"), email);
  await user.type(screen.getByPlaceholderText("Enter your password"), password);
  await user.click(screen.getByRole("button", { name: "Sign In" }));
}

describe("authentication and navigation flows", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows an error and stays on sign-in when credentials are invalid", async () => {
    const user = userEvent.setup();
    renderApp();

    await submitLogin(user, "wrong@example.com", "incorrect");

    expect(
      await screen.findByText("Invalid email or password. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeEnabled();
    expect(window.location.pathname).toBe("/");
    expect(screen.queryByText("Nicholas's Portfolio")).not.toBeInTheDocument();
  });

  it("takes a user with valid credentials to the protected portfolio", async () => {
    const user = userEvent.setup();
    renderApp();

    await submitLogin(user, VALID_EMAIL, VALID_PASSWORD);

    expect(await screen.findByText("Nicholas's Portfolio")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/portfolio");
  });

  it("redirects unauthenticated visitors from protected routes to sign-in", async () => {
    renderApp("/markets");

    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
    expect(
      screen.getByText("Sign in to access the dashboard"),
    ).toBeInTheDocument();
  });

  it("renders every primary bottom-nav route without crashing", async () => {
    const user = userEvent.setup();
    renderApp();
    await submitLogin(user, VALID_EMAIL, VALID_PASSWORD);
    await screen.findByText("Nicholas's Portfolio");

    const routes = [
      { label: "Portfolio", path: "/portfolio", content: "Nicholas's Portfolio" },
      { label: "Markets", path: "/markets", content: "Markets" },
      { label: "Watchlist", path: "/watchlist", content: "Watchlist" },
      { label: "Community", path: "/community", content: "Community" },
      { label: "Crypto AI", path: "/crypto-ai", content: "Crypto AI" },
    ];

    for (const route of routes) {
      await user.click(screen.getByRole("button", { name: new RegExp(`^${route.label}$`) }));
      await waitFor(() => {
        expect(window.location.pathname).toBe(route.path);
      });
      expect(screen.getAllByText(route.content, { exact: true }).length).toBeGreaterThan(0);
    }
  });
});