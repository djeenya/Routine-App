export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Дашборд</h1>
      <p className="mb-8 text-text-secondary">
        Сводка: сегодняшние акции и рецепт дня.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface p-6 transition-colors duration-200 hover:bg-surface-hover">
          <h2 className="mb-2 text-lg font-medium">Сегодняшние акции</h2>
          <p className="text-sm text-text-secondary">
            Здесь появится подборка скидок по магазинам.
          </p>
        </article>
        <article className="rounded-lg border border-border bg-surface p-6 transition-colors duration-200 hover:bg-surface-hover">
          <h2 className="mb-2 text-lg font-medium">Рецепт дня</h2>
          <p className="text-sm text-text-secondary">
            Здесь появится блюдо из того, что уже есть дома.
          </p>
        </article>
      </div>
    </div>
  );
}
