// Интерфейс для описания значения метрики и количества пользователей
export interface MetricValue<T> {
  value: T; // Значение метрики
  count: number; // Количество пользователей с этим значением
}

// Интерфейс для группировки метрик по категориям
export interface GroupedMetrics<T> {
  [key: string]: MetricValue<T>;
}

// Интерфейс для всех метрик VR
export interface VRMetrics {
  vrFps: GroupedMetrics<number>; // FPS (Frames Per Second)
  latency: GroupedMetrics<number>; // Задержка в миллисекундах
  resolution: GroupedMetrics<string>; // Разрешение экрана
  refreshRate: GroupedMetrics<number>; // Частота обновления экрана
  sceneComplexity: GroupedMetrics<number>; // Сложность сцены
  sessionDepth: GroupedMetrics<number>; // Глубина сессии в минутах
  vrDevice: GroupedMetrics<number>; // Устройства VR
}
