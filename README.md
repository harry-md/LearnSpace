# ĐỀ TÀI 1: KHOÁ HỌC TRỰC TUYẾN

Hệ thống được xây dựng nhằm hỗ trợ việc đăng ký, quản lý và tham gia các khóa học trực
tuyến. Người dùng hệ thống gồm ba vai trò chính: quản trị viên, giảng viên và sinh viên.
Khi đăng ký, tất cả người dùng cần cung cấp đầy đủ thông tin cá nhân và avatar để định
danh. Với vai trò giảng viên, tài khoản cần được quản trị viên duyệt và xác minh trước khi
được phép tạo và quản lý khóa học. Hệ thống phải cho phép người dùng đăng nhập, phân
quyền theo từng vai trò, và bảo đảm tính bảo mật thông tin tài khoản.

Sau khi được phê duyệt, giảng viên có thể tạo mới khóa học bằng cách cung cấp thông tin
như tên khóa học, mô tả chi tiết, hình ảnh minh họa, video giới thiệu, học phí (nếu có) và
thời lượng học. Giảng viên có thể cập nhật, chỉnh sửa, xóa khóa học và quản lý danh sách
sinh viên đã đăng ký. Ngoài ra, hệ thống cần cho phép giảng viên theo dõi tiến độ học tập
của từng sinh viên, qua đó cải thiện chất lượng giảng dạy.

Sinh viên có thể tìm kiếm các khóa học theo nhiều tiêu chí linh hoạt như tên khóa học,
giảng viên phụ trách hoặc mức học phí. Hệ thống hỗ trợ sắp xếp kết quả tìm kiếm theo tên
hoặc chi phí, đồng thời hiển thị kết quả dưới dạng phân trang với tối đa 20 khóa học mỗi
trang.

[Mở rộng] * Đối với các khóa học có học phí, sinh viên có thể lựa chọn nhiều phương thức
thanh toán khác nhau như tiền mặt trực tiếp, hoặc thanh toán trực tuyến thông qua PayPal,
Stripe, MoMo, ZaloPay. Mọi khoản giao dịch cần được ghi nhận và lưu trữ trong hệ thống
nhằm phục vụ công tác kiểm tra, quản lý và minh bạch tài chính.

Hệ thống hỗ trợ sinh viên so sánh nhiều khóa học cùng chủ đề dựa trên các tiêu chí như
nội dung giảng dạy, thời lượng học, học phí, giảng viên phụ trách.

Hệ thống cung cấp công cụ thống kê đa dạng. Giảng viên có thể xem số lượng sinh viên
tham gia khóa học, doanh thu theo từng khóa, theo tháng, quý, năm để đánh giá hiệu quả
giảng dạy. Quản trị viên được phép xem báo cáo tổng quan về toàn bộ hệ thống, bao gồm
số lượng khóa học được mở, tần suất đăng ký, doanh thu chung của trường, đồng thời có
thể mở rộng và tùy biến báo cáo để phục vụ quản lý chiến lược.

[Mở rộng] * Sinh viên và giảng viên có thể trao đổi trực tiếp thông qua tính năng chat thời
gian thực được tích hợp từ Firebase Realtime Database. 
