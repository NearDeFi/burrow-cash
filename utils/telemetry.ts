import posthogJs from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST as string;

export const isPostHogEnabled = POSTHOG_KEY && POSTHOG_HOST;

const initPostHog = () => {
  if (typeof window !== "undefined" && isPostHogEnabled) {
    posthogJs.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
    });
  }

  return posthogJs;
};

export const posthog = initPostHog();

export const track = (name, props = {}) => {
  if (!isPostHogEnabled) return;
  posthog.capture(name, props);
};

export const identifyUser = (id, traits = {}) => {
  if (!isPostHogEnabled) return;
  posthog.identify(id, traits);
};

export const trackConnectWallet = () => {
  track("Connect Wallet Clicked");
};

export const trackLogout = () => {
  track("Sign Out Clicked");
};

export const trackUseAsCollateral = (props) => {
  track("Use as collateral clicked", props);
};

export const trackMaxButton = (props) => {
  track("Max clicked", props);
};

export const trackActionButton = (action, props) => {
  track(`${action} button clicked`, props);
};

export const trackClaimButton = (location) => {
  track("Claim all button clicked", { location });
};

export const trackDisplayAsUsd = () => {
  track("Display as usd menu clicked");
};

export const trackShowDust = () => {
  track("Show dust menu clicked");
};

export const trackMaxStaking = (props) => {
  track("Max staking clicked", props);
};

export const trackStaking = (props) => {
  track("Staking button clicked", props);
};

export const trackUnstake = () => {
  track("Unstake button clicked");
};

export const trackSlimStats = (props) => {
  track("Slim stats button clicked", props);
};

export const trackFullDigits = (props) => {
  track("Full digits clicked", props);
};

export const trackToggleAmountDigits = (props) => {
  track("Display compact amounts clicked", props);
};

export const trackShowTicker = (props) => {
  track("Show ticker clicked", props);
};

export const trackShowDailyReturns = (props) => {
  track("Show daily returns", props);
};
