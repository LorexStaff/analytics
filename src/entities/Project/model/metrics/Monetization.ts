export interface MonetizationData {
  purchasesInApp: GroupedMetric<number>; // Покупки внутри приложения
  payingUsersPercentage: GroupedMetric<number>; // Процент платящих пользователей
  inAppARPU: GroupedMetric<number>; // ARPU (средний доход на пользователя) от покупок внутри приложения
  totalARPU: GroupedMetric<number>; // Общий ARPU (средний доход на пользователя)
  cumulativeTotal: GroupedMetric<number>; // Накопленный общий доход
}

// Универсальный интерфейс для группированных метрик
export interface GroupedMetric<T> {
  total: T; // Общее значение метрики
  byDevice?: Record<string, T>; // Группировка по устройствам
  byCountry?: Record<string, T>; // Группировка по странам
  byAppVersion?: Record<string, T>; // Группировка по версиям приложения
  byTrafficSource?: Record<string, T>; // Группировка по источникам трафика
  byOS?: Record<string, T>; // Группировка по операционным системам
  byDeviceModel?: Record<string, T>; // Группировка по моделям устройств
}
