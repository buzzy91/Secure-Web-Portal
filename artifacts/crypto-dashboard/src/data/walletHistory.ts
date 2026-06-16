export const CHARLES_WALLET = "TLLs5VNYsLwU3m2CDXf3J41C1F3AW7Wnxn";
export const RECIPIENT_WALLET = "TJoKTNWEVhMnVBnMHoMPibqaxUdPGcQ95u";
export const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8e...";

export interface WalletTx {
  id: string;
  type: "sent" | "received";
  amount: number;
  usdValue: number;
  date: string;
  time: string;
  status: "Completed" | "Confirmed" | "Pending";
  from?: string;
  to?: string;
  networkFee?: string;
  txHash?: string;
  bandwidth?: number;
  energy?: number;
  confirmedSRs?: number;
  confirmedBlocks?: number;
}

export const WALLET_TRANSACTIONS: WalletTx[] = [
  {
    id: "tx-001",
    type: "sent",
    amount: 150.7,
    usdValue: 150.54,
    date: "Jun 11, 2026",
    time: "6:59 PM",
    status: "Completed",
    from: CHARLES_WALLET,
    to: RECIPIENT_WALLET,
    networkFee: "0 TRX",
    txHash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    bandwidth: 345,
    energy: 64285,
    confirmedSRs: 19,
    confirmedBlocks: 200,
  },
  {
    id: "tx-002",
    type: "received",
    amount: 130,
    usdValue: 130.0,
    date: "Jun 11, 2026",
    time: "6:54 PM",
    status: "Completed",
    from: "TG2CMG...AmY76",
    to: CHARLES_WALLET,
    networkFee: "0 TRX",
  },
  {
    id: "tx-003",
    type: "sent",
    amount: 50,
    usdValue: 49.95,
    date: "Jun 11, 2026",
    time: "1:38 PM",
    status: "Completed",
    from: CHARLES_WALLET,
    to: RECIPIENT_WALLET,
    networkFee: "0 TRX",
    bandwidth: 345,
    energy: 64285,
    confirmedSRs: 19,
    confirmedBlocks: 200,
  },
  {
    id: "tx-004",
    type: "received",
    amount: 65,
    usdValue: 64.93,
    date: "Jun 10, 2026",
    time: "10:06 PM",
    status: "Completed",
    from: "TG2CMG...AmY76",
    to: CHARLES_WALLET,
    networkFee: "0 TRX",
  },
  {
    id: "tx-005",
    type: "sent",
    amount: 60.3,
    usdValue: 60.23,
    date: "Jun 10, 2026",
    time: "5:52 PM",
    status: "Completed",
    from: CHARLES_WALLET,
    to: RECIPIENT_WALLET,
    networkFee: "0.345 TRX",
    txHash: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    bandwidth: 345,
    energy: 64285,
    confirmedSRs: 19,
    confirmedBlocks: 200,
  },
  {
    id: "tx-006",
    type: "sent",
    amount: 368.7,
    usdValue: 368.7,
    date: "Jun 10, 2026",
    time: "10:04 AM",
    status: "Confirmed",
    from: CHARLES_WALLET,
    to: RECIPIENT_WALLET,
    networkFee: "0.345 TRX",
    txHash: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    bandwidth: 345,
    energy: 64285,
    confirmedSRs: 19,
    confirmedBlocks: 200,
  },
  {
    id: "tx-007",
    type: "sent",
    amount: 20.64,
    usdValue: 20.62,
    date: "Jun 10, 2026",
    time: "10:05 AM",
    status: "Completed",
    from: CHARLES_WALLET,
    to: "TUgUNV...fq9WP",
    networkFee: "0 TRX",
  },
  {
    id: "tx-008",
    type: "received",
    amount: 65,
    usdValue: 65.0,
    date: "Jun 10, 2026",
    time: "9:00 AM",
    status: "Completed",
    from: "TG2CMG...AmY76",
    to: CHARLES_WALLET,
    networkFee: "0 TRX",
  },
  {
    id: "tx-009",
    type: "sent",
    amount: 50,
    usdValue: 49.95,
    date: "Jun 9, 2026",
    time: "12:56 PM",
    status: "Completed",
    from: CHARLES_WALLET,
    to: RECIPIENT_WALLET,
    networkFee: "0 TRX",
    txHash: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    confirmedSRs: 19,
    confirmedBlocks: 200,
  },
];

export const RECIPIENT_ACCOUNT = {
  address: RECIPIENT_WALLET,
  assets: 1488.38,
  trxAvailable: 1.000047,
  trxStaked: 0,
  transactions: 32,
  transfers: { total: 45, out: 43, in: 2 },
  latestActivity: "2026-06-12 00:02:03 UTC",
  created: "2026-06-08 21:00:45 UTC",
};

export const USDT_STATS = {
  marketCap: "$89.25B",
  volume24h: "$67.49B",
  circulatingSupply: "186.93B (209.23%)",
  created: "Sep 19, 2024",
  liquidity: "$298.80M",
  securityRisk: "No risk found",
  bandwidth: 389,
  energy: 0,
};

export const TOTAL_SENT = WALLET_TRANSACTIONS
  .filter((t) => t.type === "sent")
  .reduce((sum, t) => sum + t.amount, 0);

export const TOTAL_RECEIVED = WALLET_TRANSACTIONS
  .filter((t) => t.type === "received")
  .reduce((sum, t) => sum + t.amount, 0);
