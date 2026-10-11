import "./BenchmarkToolbar.css";

interface Props {
  isOptimized: boolean;
  onToggleMode: (optimized: boolean) => void;
  totalProducts: number;
  filteredCount: number;
  renderedDomNodes: number;
  renderDuration: number;
  onOpenAnalytics: () => void;
}

export default function BenchmarkToolbar({
  isOptimized,
  onToggleMode,
  totalProducts,
  filteredCount,
  renderedDomNodes,
  renderDuration,
  onOpenAnalytics,
}: Props) {
  return (
    <aside className="benchmark-toolbar" aria-label="Thanh điều khiển tối ưu hiệu năng">
      <div className="benchmark-toolbar__inner">
        {/* Toggle Mode */}
        <div className="benchmark-toggle-group">
          <span className="benchmark-label">Chế độ hiệu năng:</span>
          <div className="benchmark-buttons">
            <button
              id="mode-unoptimized-btn"
              className={`mode-btn ${!isOptimized ? "mode-btn--active unopt" : ""}`}
              onClick={() => onToggleMode(false)}
              title="Chưa tối ưu: 10.000 items vào DOM, không memo, không virtualize"
            >
              <span className="mode-indicator unopt-dot" />
              Trước Tối Ưu (10k DOM)
            </button>
            <button
              id="mode-optimized-btn"
              className={`mode-btn ${isOptimized ? "mode-btn--active opt" : ""}`}
              onClick={() => onToggleMode(true)}
              title="Đã tối ưu: Virtualization, React.memo, Code-Splitting, Lazy Load"
            >
              <span className="mode-indicator opt-dot" />
              Sau Tối Ưu (Virtual Grid)
            </button>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="benchmark-stats">
          <div className="stat-pill">
            <span className="stat-name">Tổng dữ liệu:</span>
            <strong className="stat-value">{totalProducts.toLocaleString("vi-VN")} sp</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-name">Kết quả lọc:</span>
            <strong className="stat-value">{filteredCount.toLocaleString("vi-VN")}</strong>
          </div>
          <div className={`stat-pill ${renderedDomNodes > 1000 ? "stat-pill--warn" : "stat-pill--good"}`}>
            <span className="stat-name">DOM Nodes ước tính:</span>
            <strong className="stat-value">~{renderedDomNodes.toLocaleString("vi-VN")} nodes</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-name">Render Time:</span>
            <strong className="stat-value">{renderDuration.toFixed(1)} ms</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="benchmark-actions">
          <button
            id="open-analytics-btn"
            className="action-btn analytics-btn"
            onClick={onOpenAnalytics}
            title="Mở modal phân tích (Demo Code-Splitting / React.lazy)"
          >
            📊 Thống kê (Lazy)
          </button>
        </div>
      </div>
    </aside>
  );
}
