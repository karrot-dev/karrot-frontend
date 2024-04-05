import { QBtn, QCard } from 'quasar'
export default () => {
  setDefaults(QBtn, {
    unelevated: true,
  })
  setDefaults(QCard, {
    flat: true,
  })
}

function setDefaults (component, defaults) {
  Object.keys(defaults).forEach(prop => {
    component.props[prop] =
      Array.isArray(component.props[prop]) === true || typeof component.props[prop] === 'function'
        ? { type: component.props[prop], default: (defaults)[prop] }
        : { ...component.props[prop], default: (defaults)[prop] }
  })
};
