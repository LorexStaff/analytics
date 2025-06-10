// Интерфейс для группировки данных (например, по устройствам, странам или версиям приложения)
interface Grouping<T = number> {
  [key: string]: T;
}

// Интерфейс для распределения значений метрик
interface MetricDistribution {
  total: number; // Общее количество пользователей с этим значением метрики
  byDevice: Grouping<number>; // Группировка по устройствам
  byCountry: Grouping<number>; // Группировка по странам
  byAppVersion: Grouping<number>; // Группировка по версиям приложения
}

// Интерфейс для времени загрузки
interface LoadTimeMetric {
  averageLoadTime: number; // Среднее время загрузки
  byDevice: Grouping<number>; // Время загрузки по устройствам
  byCountry: Grouping<number>; // Время загрузки по странам
  byAppVersion: Grouping<number>; // Время загрузки по версиям приложения
}

// Интерфейс для метрик производительности
export interface PerformanceMetrics {
  fps: {
    [fpsValue: number]: MetricDistribution; // Распределение FPS
  };
  screenResolutions: {
    [resolution: string]: MetricDistribution; // Распределение разрешений экранов
  };
  graphicsSettings: {
    [setting: string]: MetricDistribution; // Распределение настроек графики
  };
  loadTime: LoadTimeMetric; // Время загрузки
}

export {};
