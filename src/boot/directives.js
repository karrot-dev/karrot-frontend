import { raggedEdgesDirective } from '@/utils/svgUtils'

export default ({ app }) => {
  app.directive('ragged-edges', raggedEdgesDirective)
}
