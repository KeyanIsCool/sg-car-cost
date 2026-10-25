export const metadata = { title: "Privacy" };
export default function Page() {
  return (
    <article className="space-y-3 text-sm text-ink-600">
      <h1 className="text-2xl font-bold text-ink-900">Privacy</h1>
      <p>This site does not require an account for basic calculations.</p>
      <p>
        We may collect anonymous usage analytics to improve the calculator. If advertising is enabled,
        ad networks may set cookies as described in their own policies.
      </p>
      <p>
        Any values you enter — vehicle details, income, parking — stay in your browser unless you
        choose to generate a shareable calculation link.
      </p>
    </article>
  );
}
