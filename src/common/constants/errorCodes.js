export const ERROR_CODE_MESSAGES = {
  INVALID_CREDENTIALS: 'Sai tài khoản hoặc mật khẩu.',
  USER_NOT_FOUND: 'Không tìm thấy người dùng.',
  USERNAME_EXISTS: 'Tên tài khoản đã được sử dụng.',
  EMAIL_EXISTS: 'Email đã được sử dụng.',
  PHONE_EXISTS: 'Số điện thoại đã được sử dụng.',
  INVALID_COUPON: 'Mã giảm giá không hợp lệ.',
  COUPON_EXPIRED: 'Mã giảm giá đã hết hạn.',
  COUPON_NOT_APPLICABLE: 'Mã giảm giá không áp dụng cho đơn hàng này.',
  OUT_OF_STOCK: 'Sản phẩm đã hết hàng.',
  PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm.',
  CART_ITEM_NOT_FOUND: 'Không tìm thấy sản phẩm trong giỏ hàng.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại.',
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  SERVER_ERROR: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau.',
  NETWORK_ERROR: 'Không thể kết nối máy chủ, vui lòng kiểm tra kết nối mạng.',
  TIMEOUT: 'Yêu cầu quá thời gian chờ, vui lòng thử lại.',
}

export const DEFAULT_ERROR_MESSAGE = 'Đã có lỗi xảy ra, vui lòng thử lại.'

export const HTTP_STATUS_MESSAGES = {
  400: 'Yêu cầu không hợp lệ.',
  401: ERROR_CODE_MESSAGES.UNAUTHORIZED,
  403: ERROR_CODE_MESSAGES.FORBIDDEN,
  404: ERROR_CODE_MESSAGES.NOT_FOUND,
  409: 'Dữ liệu đã tồn tại hoặc bị xung đột.',
  422: ERROR_CODE_MESSAGES.VALIDATION_ERROR,
  500: ERROR_CODE_MESSAGES.SERVER_ERROR,
  502: ERROR_CODE_MESSAGES.SERVER_ERROR,
  503: ERROR_CODE_MESSAGES.SERVER_ERROR,
}
