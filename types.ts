export enum ViewMode {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}

export interface VentureConfig {
  projectName: string;
  tagline: string;
  brandColors: {
    primary: string;
    secondary: string;
    background: string;
  };
  pricingModel: {
    type: 'Subscription' | 'Commission' | 'Freemium';
    basePrice: number;
    premiumMultiplier: number;
    currencySymbol: string;
  };
  databaseSchema: {
    tables: Array<{
      name: string;
      columns: string[];
    }>;
  };
  featureFlags: {
    mvp: string[];
    v2: string[];
  };
}

export interface ExecutiveStrategy {
  problemStatement: string;
  solutionDescription: string;
  monetizationStrategy: string;
}

export interface InvestorDeck {
  slide4BusinessModel: {
    title: string;
    points: string[];
    projectedRevenueYear1: string;
  };
  slide7TheAsk: {
    amount: string;
    equity: string;
    runwayMonths: number;
    useOfFunds: string[];
  };
}

export interface VentureData {
  config: VentureConfig;
  strategy: ExecutiveStrategy;
  deck: InvestorDeck;
}

export const INITIAL_DATA: VentureData = {
  config: {
    projectName: "Venture-OS",
    tagline: "Synchronized Startup Architect",
    brandColors: { primary: "#00f0ff", secondary: "#7000ff", background: "#0a0a0f" },
    pricingModel: { type: 'Subscription', basePrice: 29, premiumMultiplier: 10, currencySymbol: '$' },
    databaseSchema: { tables: [] },
    featureFlags: { mvp: [], v2: [] }
  },
  strategy: {
    problemStatement: "",
    solutionDescription: "",
    monetizationStrategy: ""
  },
  deck: {
    slide4BusinessModel: { title: "", points: [], projectedRevenueYear1: "" },
    slide7TheAsk: { amount: "", equity: "", runwayMonths: 18, useOfFunds: [] }
  }
};