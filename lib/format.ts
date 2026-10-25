export const sgd = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(isFinite(n) ? n : 0);

export const sgdPrecise = (n: number) => sgd(n, { maximumFractionDigits: 2 });

export const num = (n: number, d = 0) =>
  new Intl.NumberFormat("en-SG", { maximumFractionDigits: d }).format(isFinite(n) ? n : 0);
