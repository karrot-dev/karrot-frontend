export function useFeedbackHelpers () {
  function formatFeedbackWeight (weight) {
    if (weight >= 1000000) {
      return ['999+', 't']
    }
    if (weight >= 1000) {
      return [Number(weight / 1000.0).toFixed(1), 't']
    }
    if (weight >= 1) {
      return [Number(weight).toFixed(1), 'kg']
    }
    return [Number(weight * 1000).toFixed(0), 'g']
  }
  return {
    formatFeedbackWeight,
  }
}
