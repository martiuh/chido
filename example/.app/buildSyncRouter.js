/*
  @obj: Component
*/
// TODO: Make ita looop
export default function buildSyncRoute(obj, routeName, routeObj = null) {
  // If the component have props
  /*
    1. If it has props.path then it's a Router object meaning it's the mai.
    2. If it has props.children then it could have another Router underneath, making the component a 'parent'
  */
  if (obj.children) {
    if (Array.isArray(obj.children)) {
      obj.children.forEach(child => {
        routeObj = buildSyncRoute(child, routeName, routeObj)
      })
    }
    else {
      routeObj = buildSyncRoute(obj.children, routeName, routeObj)
    }
  }

  const buildPath = () => `${routeName}*`

  if (obj.props) {
    if (Array.isArray(obj.props)) {
      obj.props.forEach(prop => {
        routeObj = buildSyncRoute(prop, routeName, routeObj)
      })
    }
    else if (Array.isArray(obj.props.children)) {
      obj.props.children.forEach(prop => {
        routeObj = buildSyncRoute(prop, routeName, routeObj)
      })
    }
    else if (obj.props.path && !obj.props.children) {
      return buildPath()
    }

    else if (obj.props.path && obj.props.children) {
      return buildPath()
    }
  }

  return routeObj
}
