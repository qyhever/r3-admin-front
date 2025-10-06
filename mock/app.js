export default [
  {
    url: '/dev/user/login',
    method: 'post',
    response: () => {
      return {
        success: true,
        data: {
          token: 'foo',
        },
      }
    },
  },
  {
    url: '/dev/user/info',
    method: 'get',
    response: () => {
      return {
        success: true,
        data: {
          usernmae: 'foo',
        },
      }
    },
  },
]
