export const metadata = { title: "Methodology" };

export default function Page() {
  return (
    <article className="prose max-w-none space-y-4 text-sm text-ink-600">
      <h1 className="text-2xl font-bold tracking-tight text-ink-900">Methodology</h1>
      <p>
        Every number is derived from a transparent, user-editable assumption. The calculation engine
        lives in <code>/lib/calculations</code> and is covered by unit tests.
      </p>
      <ul className="list-disc pl-5">
        <li>
          <b>Financing</b> — Singapore flat-rate loan: total interest = principal × flat rate × years.
          Monthly instalment = (principal + interest) / months.
        </li>
        <li>
          <b>Depreciation</b> — (purchase price − expected resale) / ownership years. If resale isn't
          provided, we estimate with a 10% annual decline, floored at the PARF rebate at COE expiry.
        </li>
        <li>
          <b>Road tax</b> — indicative formula from LTA's 6-monthly table (petrol/diesel/hybrid by cc;
          EV by motor kW with an additional flat component). Rules carry an effective date.
        </li>
        <li>
          <b>Petrol / energy</b> — distance × consumption × price per unit.
        </li>
        <li>
          <b>Insurance</b> — base of ~1.2% of vehicle value, adjusted for age, experience, NCD and
          performance. This is <i>not</i> an insurance quote; use your actual quote to override.
        </li>
        <li>
          <b>Parking, ERP, maintenance, tyres, misc</b> — user-provided or preset.
        </li>
      </ul>
      <p>
        All displayed data (fuel prices, loan rates, road-tax rules) carries an effective date in the
        source files. Rates are indicative; see <a href="/data-sources">data sources</a>.
      </p>
    </article>
  );
}
