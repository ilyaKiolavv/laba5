import React from 'react';

const CATEGORIES = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'jewelery', label: 'Ювелирные изделия' },
  { value: "men's clothing", label: 'Мужская одежда' },
  { value: "women's clothing", label: 'Женская одежда' },
];

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '8px',
  border: hasError ? '1px solid red' : '1px solid #ccc',
  borderRadius: '4px',
});

const errorStyle = { color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' };

// Компонент фильтров: хранит локальные значения полей и отдаёт их родителю по кнопке
export function Filters({ onFilterChange, initialFilters, priceLimit }) {
  // Доп. задание 1: несколько категорий — массив в useState
  const [localCategories, setLocalCategories] = React.useState(initialFilters.categories || []);
  const [localMinPrice, setLocalMinPrice] = React.useState(
    initialFilters.minPrice !== undefined ? String(initialFilters.minPrice) : ''
  );
  const [localMaxPrice, setLocalMaxPrice] = React.useState(
    initialFilters.maxPrice !== undefined ? String(initialFilters.maxPrice) : ''
  );

  // Ошибки валидации
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const errs = {};
    const min = localMinPrice !== '' ? Number(localMinPrice) : undefined;
    const max = localMaxPrice !== '' ? Number(localMaxPrice) : undefined;

    // Проверка на отрицательные значения
    if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }
    if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }
    // Проверка диапазона: только если оба поля заполнены и оба валидны
    if (min !== undefined && max !== undefined && min >= 0 && max >= 0 && min > max) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }
    return errs;
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);
    // Если есть ошибки — не отправляем фильтры
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories,
      minPrice: localMinPrice !== '' ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice !== '' ? Number(localMaxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setLocalCategories([]);
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setErrors({});
    onFilterChange({ categories: [], minPrice: undefined, maxPrice: undefined });
  };

  // Добавляем категорию в массив или убираем, если она уже выбрана
  const handleCategoryToggle = (value) => {
    setLocalCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  // Сбрасываем ошибку поля при ручном изменении,
  // чтобы она не висела после того, как пользователь начал исправлять значение.
  // Эти же обработчики используются и для числового поля, и для ползунка (доп. задание 2)
  const handleMinChange = (e) => {
    setLocalMinPrice(e.target.value);
    setErrors((prev) => ({ ...prev, min: '' }));
  };

  const handleMaxChange = (e) => {
    setLocalMaxPrice(e.target.value);
    setErrors((prev) => ({ ...prev, max: '' }));
  };

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fff', borderRadius: '8px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <label>Категории</label>
          {CATEGORIES.map((cat) => (
            <label
              key={cat.value}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'normal', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={localCategories.includes(cat.value)}
                onChange={() => handleCategoryToggle(cat.value)}
              />
              {cat.label}
            </label>
          ))}
          <span style={{ fontSize: '0.85rem', color: '#777' }}>Ничего не выбрано — все категории</span>
        </div>

        <div>
          <label>Цена от</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            style={inputStyle(errors.min)}
          />
          <input
            type="range"
            min="0"
            max={priceLimit}
            value={localMinPrice === '' ? 0 : localMinPrice}
            onChange={handleMinChange}
            style={{ width: '100%', marginTop: '8px' }}
          />
          {errors.min && <span style={errorStyle}>{errors.min}</span>}
        </div>

        <div>
          <label>Цена до</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder={String(priceLimit)}
            min="0"
            style={inputStyle(errors.max)}
          />
          <input
            type="range"
            min="0"
            max={priceLimit}
            value={localMaxPrice === '' ? priceLimit : localMaxPrice}
            onChange={handleMaxChange}
            style={{ width: '100%', marginTop: '8px' }}
          />
          {errors.max && <span style={errorStyle}>{errors.max}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleApply}
          style={{
            padding: '10px 24px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Применить фильтры
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '10px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
