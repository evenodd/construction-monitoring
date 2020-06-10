class RouteUtils {
    static asyncRoute (route) {
        return (req, res, next = console.error) => Promise.resolve(route(req, res, next)).catch(next)
    }

    static timeout (ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

module.exports = RouteUtils;