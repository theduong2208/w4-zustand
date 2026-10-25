"use server";

import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth";
import { updateStock, deleteProduct, resetProducts, ExtendedProduct } from "@/lib/productsData";

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
  callerRole?: string;
}

/**
 * 🛡️ LỚP BẢO VỆ 3: Server Action RBAC Guard
 * Chỉ tài khoản có vai trò 'admin' mới được phép thực thi
 */
export async function updateProductStockAction(
  productId: string,
  newStock: number
): Promise<ActionResult<ExtendedProduct>> {
  // 1. Kiểm tra phiên đăng nhập trên Server (Zero-Trust)
  const session = await getAuthSession();

  if (!session || !session.user) {
    return {
      success: false,
      statusCode: 401,
      error: "401 Unauthorized: Bạn chưa đăng nhập. Vui lòng đăng nhập tài khoản Quản trị viên!",
      message: "Yêu cầu đăng nhập trước khi cập nhật tồn kho.",
    };
  }

  // 2. Kiểm tra vai trò Admin trên Server Action
  if (session.user.role !== "admin") {
    return {
      success: false,
      statusCode: 403,
      callerRole: session.user.role,
      error: `403 Forbidden: Tài khoản của bạn mang vai trò "${session.user.role}". Chỉ Quản trị viên (Admin) mới có quyền sửa đổi sản phẩm!`,
      message: "Bị từ chối bởi Server Action RBAC Guard.",
    };
  }

  // 3. Thực thi nghiệp vụ nếu hợp lệ
  const updated = updateStock(productId, newStock, session.user.name || session.user.email || "Admin");

  if (!updated) {
    return {
      success: false,
      statusCode: 404,
      error: `Không tìm thấy sản phẩm có mã ${productId}!`,
      message: "Lỗi dữ liệu",
    };
  }

  // Revalidate cache cho các trang liên quan
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/products/${productId}`);

  return {
    success: true,
    statusCode: 200,
    callerRole: session.user.role,
    message: `[Server Action] Đã cập nhật tồn kho sản phẩm "${updated.name}" thành ${updated.stock} sản phẩm (thực hiện bởi Admin: ${session.user.name}).`,
    data: updated,
  };
}

/**
 * Server Action Xóa sản phẩm - Chỉ dành cho Admin
 */
export async function deleteProductAction(productId: string): Promise<ActionResult> {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return {
      success: false,
      statusCode: 401,
      error: "401 Unauthorized: Vui lòng đăng nhập!",
      message: "Yêu cầu đăng nhập.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      statusCode: 403,
      callerRole: session.user.role,
      error: `403 Forbidden: Vai trò "${session.user.role}" không có quyền xóa sản phẩm. Chỉ Admin mới có quyền!`,
      message: "Từ chối quyền xóa.",
    };
  }

  const success = deleteProduct(productId);
  if (!success) {
    return {
      success: false,
      statusCode: 404,
      error: "Không tìm thấy sản phẩm để xóa.",
      message: "Thao tác thất bại.",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    success: true,
    statusCode: 200,
    callerRole: session.user.role,
    message: `[Server Action] Đã xóa sản phẩm mã "${productId}" thành công.`,
  };
}

/**
 * Server Action Demo Test Bảo Vệ Server Action:
 * Cho phép UI gọi trực tiếp để chứng minh Server Action từ chối User thường và chấp nhận Admin
 */
export async function testServerActionGuardAction(): Promise<ActionResult> {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return {
      success: false,
      statusCode: 401,
      error: "401 Unauthorized: Không phát hiện phiên đăng nhập!",
      message: "Lớp bảo vệ Server Action: Đã chặn truy cập ẩn danh.",
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      statusCode: 403,
      callerRole: session.user.role,
      error: `403 Forbidden: Phiên đăng nhập thuộc về "${session.user.name}" (Role: ${session.user.role}). Server Action đã chặn lệnh vì không đủ quyền Admin!`,
      message: "Kiểm tra RBAC Server Action thành công: Đã chặn đúng đối tượng.",
    };
  }

  return {
    success: true,
    statusCode: 200,
    callerRole: "admin",
    message: `200 OK: Xin chào ${session.user.name} (Role: ${session.user.role})! Server Action đã xác thực quyền Admin hợp lệ và cho phép thực thi tác vụ nhạy cảm.`,
  };
}

/**
 * Server Action Khôi phục dữ liệu mẫu
 */
export async function resetProductsAction(): Promise<ActionResult> {
  const session = await getAuthSession();
  if (!session || session.user.role !== "admin") {
    return {
      success: false,
      statusCode: 403,
      error: "Chỉ Admin mới có quyền reset dữ liệu!",
      message: "Từ chối thao tác.",
    };
  }
  resetProducts();
  revalidatePath("/");
  revalidatePath("/admin");
  return {
    success: true,
    statusCode: 200,
    message: "Đã khôi phục dữ liệu mẫu thành công!",
  };
}
