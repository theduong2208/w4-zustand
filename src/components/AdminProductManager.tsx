"use client";

import React, { useState, useTransition } from "react";
import type { ExtendedProduct } from "@/lib/productsData";
import {
  updateProductStockAction,
  deleteProductAction,
  resetProductsAction,
  ActionResult,
} from "@/actions/adminActions";

interface Props {
  initialProducts: ExtendedProduct[];
  adminName: string;
}

export default function AdminProductManager({ initialProducts, adminName }: Props) {
  const [products, setProducts] = useState<ExtendedProduct[]>(initialProducts);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStartEdit = (product: ExtendedProduct) => {
    setEditingStockId(product.id);
    setStockInput(product.stock);
    setStatusMessage(null);
  };

  const handleSaveStock = (productId: string) => {
    startTransition(async () => {
      const res = await updateProductStockAction(productId, stockInput);
      setStatusMessage(res);
      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? (res.data as ExtendedProduct) : p))
        );
        setEditingStockId(null);
      }
    });
  };

  const handleDelete = (productId: string, productName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" (Mã: ${productId})?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deleteProductAction(productId);
      setStatusMessage(res);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    });
  };

  const handleResetData = () => {
    startTransition(async () => {
      const res = await resetProductsAction();
      setStatusMessage(res);
      if (res.success) {
        window.location.reload();
      }
    });
  };

  return (
    <div className="admin-manager-container">
      {/* Action feedback bar */}
      {statusMessage && (
        <div
          className={`manager-alert ${
            statusMessage.success ? "manager-alert-success" : "manager-alert-error"
          }`}
        >
          <span className="alert-status-icon">{statusMessage.success ? "✅" : "❌"}</span>
          <div className="alert-body">
            <strong>{statusMessage.success ? "Thành công (Server Action)" : "Bị chặn (Server Action Guard)"}: </strong>
            <span>{statusMessage.success ? statusMessage.message : statusMessage.error}</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="manager-toolbar">
        <div>
          <h2 className="manager-section-title">Quản Lý Danh Sách & Tồn Kho (Server Actions)</h2>
          <p className="manager-sub">
            Thao tác trực tiếp với Server Actions có kiểm tra quyền hạn <code>role: 'admin'</code>
          </p>
        </div>
        <button
          onClick={handleResetData}
          disabled={isPending}
          className="btn-reset-data"
          title="Khôi phục lại danh sách 8 sản phẩm mẫu ban đầu"
        >
          🔄 Khôi phục dữ liệu mẫu
        </button>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Tồn kho (Server Action)</th>
              <th>Thao tác Quản trị</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="table-img-cell">
                  <img src={p.image} alt={p.name} className="table-thumb" width={48} height={36} />
                </td>
                <td>
                  <code className="code-id">{p.id}</code>
                </td>
                <td className="font-semibold">{p.name}</td>
                <td>
                  <span className="cat-badge">{p.category}</span>
                </td>
                <td className="font-mono">{p.price.toLocaleString("vi-VN")}₫</td>
                <td>
                  {editingStockId === p.id ? (
                    <div className="stock-edit-group">
                      <input
                        type="number"
                        min="0"
                        value={stockInput}
                        onChange={(e) => setStockInput(Number(e.target.value))}
                        className="stock-input"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveStock(p.id)}
                        disabled={isPending}
                        className="btn-save-stock"
                      >
                        {isPending ? "Lưu..." : "Lưu"}
                      </button>
                      <button
                        onClick={() => setEditingStockId(null)}
                        className="btn-cancel-stock"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="stock-display-group">
                      <span className={`stock-number ${p.stock <= 10 ? "stock-low" : ""}`}>
                        {p.stock} cái
                      </span>
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="btn-edit-stock"
                        title="Chỉnh sửa tồn kho bằng Server Action"
                      >
                        ✏️ Sửa
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={isPending}
                    className="btn-delete-product"
                    title="Xóa sản phẩm bằng Server Action"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
