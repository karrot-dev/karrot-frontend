export default {
  $route: {
    query: {},
    params: {},
  },
  $router: {
    resolve: () => ({ href: '#/' }),
    // Mimic both callback and Promise API
    push: (_, onComplete) => onComplete ? {} : Promise.resolve({}),
    replace: (_, onComplete) => onComplete ? {} : Promise.resolve({}),
  },
}
