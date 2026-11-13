import { useState, useEffect } from 'react';
import { Filters } from './Filters';
import { ProductCard } from './ProductCard';

// Контейнер: здесь вся логика и состояние
export function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние фильтров (categories — массив выбранных категорий, доп. задание 1)
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  // 1. Загрузка данных при монтировании
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Публичный API fakestoreapi — бесплатный, без ключей, CORS разрешён
        const res = await fetch('https://fakestoreapi.com/products', {
          signal: controller.signal,
        });

        // fetch не считает 404/500 ошибкой — проверяем вручную
        if (!res.ok) {
          throw new Error(`Ошибка сети: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        // Если запрос отменили (компонент размонтирован), ошибку не показываем
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Функция очистки: отменяет запрос, если компонент удалили до его завершения
    return () => controller.abort();
  }, []);

  // 2. Фильтрация: пересчитываем список при изменении товаров или фильтров
  useEffect(() => {
    let result = products;

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    // По методичке фильтрация делается во втором useEffect, поэтому отключаем это правило линтера
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredProducts(result);
  }, [products, filters]);

  if (loading) return <p style={{ textAlign: 'center' }}>Загрузка товаров...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Ошибка: {error}</p>;

  // Максимальная цена среди товаров — граница для ползунков
  const priceLimit = Math.ceil(Math.max(0, ...products.map((p) => p.price)));

  return (
    <section>
      <Filters onFilterChange={setFilters} initialFilters={filters} priceLimit={priceLimit} />

      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Найдено товаров: {filteredProducts.length} из {products.length}
      </p>

      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>Товары не найдены по выбранным фильтрам.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
