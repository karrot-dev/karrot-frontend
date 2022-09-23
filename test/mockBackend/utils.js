// Can't use the normal one as we've made random not random for tests...
// Only exists in Jest environment, so fall back to Math.random outside of it (e.g. Storybook)
export function realSample (items) {
  const random = Math.realRandom || Math.random
  return items[Math.floor(random() * items.length)]
}
