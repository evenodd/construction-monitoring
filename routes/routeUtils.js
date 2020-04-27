class RouteUtils {
    static asyncRoute (route) {
        return (req, res, next = console.error) => Promise.resolve(route(req, res, next)).catch(next)
    }
}

module.exports = RouteUtils;