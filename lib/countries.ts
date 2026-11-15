export const countries = [
  ['Australia', '🇦🇺'], ['Austria', '🇦🇹'], ['Canada', '🇨🇦'], ['China', '🇨🇳'], ['France', '🇫🇷'], ['Germany', '🇩🇪'], ['Ireland', '🇮🇪'], ['Italy', '🇮🇹'], ['Japan', '🇯🇵'], ['Netherlands', '🇳🇱'], ['New Zealand', '🇳🇿'], ['Singapore', '🇸🇬'], ['Spain', '🇪🇸'], ['Sweden', '🇸🇪'], ['Switzerland', '🇨🇭'], ['United Arab Emirates', '🇦🇪'], ['United Kingdom', '🇬🇧'], ['United States', '🇺🇸']
] as const

const aliases: Record<string, string> = { USA: '🇺🇸', US: '🇺🇸', UK: '🇬🇧', UAE: '🇦🇪' }
export function countryFlag(country: string) { return aliases[country] || countries.find(([name]) => name === country)?.[1] || '🌍' }
