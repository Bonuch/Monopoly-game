export default function isAdminLoggedIn({ next, router, store }) {

    if (store) {
        let user = store.getters.currentUser
        if (user && user.role == 'Administrator') {
            return next()
        }
    }

    return router.push('/admin/login')
}
