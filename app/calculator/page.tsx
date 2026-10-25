import { CalculatorClient } from "./CalculatorClient";

export const metadata = {
  title: "Car Ownership Cost Calculator",
  description:
    "Enter your car, driving profile, parking, loan and running costs — see your real monthly cost of ownership in Singapore.",
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your real monthly cost of owning a car
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-600">
          About 2 minutes. Change any assumption and the estimate updates instantly.
        </p>
      </div>
      <CalculatorClient />
    </div>
  );
}
