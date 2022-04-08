import posthogJs from "posthog-js";

const POSTHOG_KEY = process.env.POSTHOG_KEY as string;
const POSTHOG_HOST = process.env.POSTHOG_HOST as string;

const isEnabled = POSTHOG_KEY && POSTHOG_HOST;

const initPostHog = () => {
  if (typeof window !== "undefined" && isEnabled) {
    posthogJs.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
    });
  }

  return posthogJs;
};

const posthog = initPostHog();

export const track = (name, props = {}) => {
  if (!isEnabled) return;
  posthog.capture(name, props);
};

export const identifyUser = (id, traits = {}) => {
  if (!isEnabled) return;
  posthog.identify(id, traits);
};

export const trackConnectWallet = () => {
  track("Connect Wallet Clicked");
};

export const trackLogout = () => {
  track("Log Out Clicked");
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

export const trackClaimButton = () => {
  track("Calim all button clicked");
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
