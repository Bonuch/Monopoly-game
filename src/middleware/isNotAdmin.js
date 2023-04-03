export default function isNotAdmin({ next, router, store }) {
//   if (store) {
//       let user = store.getters.currentUser
//       if (user && user.role == 'Administrator') {
//           return router.push('/admin')
//       }
//   }

  return next()
}
